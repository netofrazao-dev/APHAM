// ============================================================================
//  Frete automático pelo Melhor Envio (Correios e outras transportadoras).
//  Só no servidor: o token fica na variável MELHOR_ENVIO_TOKEN da Vercel.
//  Usado por /api/frete (opções no carrinho e no checkout) e por montarPedido,
//  que refaz a cotação ao criar o pedido — o valor do navegador não vale.
//  Doc: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos
// ============================================================================

const arred = (v) => Math.round((Number(v) || 0) * 100) / 100
const soDigitos = (v) => String(v ?? '').replace(/\D/g, '')

// Iguais aos de src/pages/admin/SettingsAdmin.jsx (valores sugeridos no painel).
// Embalagem padrão, para produtos sem peso/medidas: camiseta dobrada em envelope.
export const PACOTE_PADRAO = { peso: 0.3, altura: 4, largura: 20, comprimento: 30 }
export const CEP_ORIGEM_PADRAO = '68800000' // Breves/PA
export const PRAZO_EXTRA_PADRAO = 2 // dias úteis para separar e postar

const token = () => process.env.MELHOR_ENVIO_TOKEN
const host = () =>
  process.env.MELHOR_ENVIO_SANDBOX === 'true' ? 'https://sandbox.melhorenvio.com.br' : 'https://melhorenvio.com.br'

export const freteConfigurado = () => Boolean(token())
// Ligado quando há token e a APHAM não desligou no painel (Configurações → Frete).
export const freteAtivo = (settings) => freteConfigurado() && settings?.freteAutomatico !== false

// Chamada à API do Melhor Envio. Erro → Error com o status e a mensagem deles.
export async function melhorEnvio(caminho, { method = 'GET', body, timeout = 15000 } = {}) {
  const contato = process.env.MELHOR_ENVIO_EMAIL || process.env.NOTIFY_EMAIL || 'apham.cvmf@gmail.com'
  const r = await fetch(`${host()}/api/v2/me${caminho}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
      'User-Agent': `Loja APHAM (${contato})`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  })
  const txt = await r.text()
  let j = null
  try {
    j = txt ? JSON.parse(txt) : null
  } catch {
    /* resposta sem JSON */
  }
  if (!r.ok) {
    const e = new Error(`Melhor Envio ${r.status}: ${mensagemErro(j) || txt.slice(0, 300)}`)
    e.status = r.status
    throw e
  }
  return j
}

// Junta as mensagens de erro do Melhor Envio ({ message, errors: { campo: [..] } }).
function mensagemErro(j) {
  if (!j || typeof j !== 'object') return ''
  const lista = []
  if (j.message) lista.push(j.message)
  if (j.error) lista.push(typeof j.error === 'string' ? j.error : JSON.stringify(j.error))
  if (j.errors && typeof j.errors === 'object') {
    for (const [campo, v] of Object.entries(j.errors)) lista.push(`${campo}: ${[].concat(v).join(' ')}`)
  }
  return lista.join(' · ').slice(0, 400)
}

// Correios (PAC, SEDEX, Mini Envios): o volume vai como objeto, não lista.
export const SERVICOS_CORREIOS = ['1', '2', '17']

// Valor declarado (seguro) nos Correios é opcional e encarece o frete. Ligado
// só quando a APHAM marcar em Configurações → Frete.
export const comSeguro = (settings) => settings?.freteSeguro === true

const medida = (v, padrao) => Math.max(1, Math.ceil(Number(v) > 0 ? Number(v) : padrao))
const numeroOu = (v, padrao) => (v != null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : padrao)

// itens: [{ produto, qtd, preco }] — preço unitário de venda (valor do seguro,
// se ligado). Devolve as opções ordenadas pelo preço: [{ id, nome, preco, prazo }].
// `detalhe` (opcional) recebe o que foi enviado e o que o Melhor Envio devolveu,
// para o teste do painel explicar o preço.
export async function cotarFrete({ cep, itens, settings = {}, detalhe }) {
  const destino = soDigitos(cep)
  if (destino.length !== 8) throw new Error('CEP inválido')
  // Embalagem padrão do painel, campo a campo (vazio ou zero = o valor padrão).
  const pacote = Object.fromEntries(
    Object.entries(PACOTE_PADRAO).map(([k, v]) => [k, Number(settings.fretePacote?.[k]) > 0 ? Number(settings.fretePacote[k]) : v])
  )
  const products = itens.map(({ produto: p, qtd, preco }) => ({
    id: String(p.id),
    width: medida(p.largura, pacote.largura),
    height: medida(p.altura, pacote.altura),
    length: medida(p.comprimento, pacote.comprimento),
    weight: Number(p.peso) > 0 ? Number(p.peso) : pacote.peso,
    insurance_value: comSeguro(settings) ? arred(preco) : 0,
    quantity: qtd,
  }))
  const origem = soDigitos(settings.freteCepOrigem) || CEP_ORIGEM_PADRAO
  const lista = await melhorEnvio('/shipment/calculate', {
    method: 'POST',
    body: { from: { postal_code: origem }, to: { postal_code: destino }, products },
    timeout: 9000,
  })

  const soCorreios = settings.freteSoCorreios !== false
  const adicional = arred(numeroOu(settings.freteAdicional, 0))
  const prazoExtra = Math.max(0, Math.round(numeroOu(settings.fretePrazoExtra, PRAZO_EXTRA_PADRAO)))
  if (detalhe) {
    Object.assign(detalhe, {
      origem,
      destino,
      seguro: comSeguro(settings),
      adicional,
      enviado: products.map(({ id, quantity, weight, height, width, length, insurance_value }) => ({ id, quantity, weight, height, width, length, insurance_value })),
      melhorEnvio: (Array.isArray(lista) ? lista : [])
        .filter((s) => !soCorreios || s.company?.id === 1 || /correios/i.test(s.company?.name || ''))
        .map((s) => ({
          nome: [s.company?.name, s.name].filter(Boolean).join(' '),
          price: s.price ?? null,
          custom_price: s.custom_price ?? null,
          discount: s.discount ?? null,
          erro: s.error || null,
          pacotes: (s.packages || []).map((pk) => ({ peso: pk.weight, ...(pk.dimensions || {}) })),
        })),
    })
  }
  return (Array.isArray(lista) ? lista : [])
    // Serviço que não atende o trecho vem sem preço (ou com "error").
    .filter((s) => !s.error && Number(s.custom_price ?? s.price) > 0)
    .filter((s) => !soCorreios || s.company?.id === 1 || /correios/i.test(s.company?.name || ''))
    .map((s) => {
      const prazo = Number(s.custom_delivery_time ?? s.delivery_time)
      return {
        id: String(s.id),
        nome: [s.company?.name, s.name].filter(Boolean).join(' '),
        preco: arred(Number(s.custom_price ?? s.price) + adicional),
        prazo: prazo > 0 ? prazo + prazoExtra : null,
      }
    })
    .sort((a, b) => a.preco - b.preco)
}
