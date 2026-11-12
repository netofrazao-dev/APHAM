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

const medida = (v, padrao) => Math.max(1, Math.ceil(Number(v) > 0 ? Number(v) : padrao))
const numeroOu = (v, padrao) => (v != null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : padrao)

// itens: [{ produto, qtd, preco }] — preço unitário de venda (vai como valor do seguro).
// Devolve as opções ordenadas pelo preço: [{ id, nome, preco, prazo }].
export async function cotarFrete({ cep, itens, settings = {} }) {
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
    insurance_value: arred(preco),
    quantity: qtd,
  }))
  const contato = process.env.MELHOR_ENVIO_EMAIL || process.env.NOTIFY_EMAIL || 'apham.cvmf@gmail.com'
  const r = await fetch(`${host()}/api/v2/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
      'User-Agent': `Loja APHAM (${contato})`,
    },
    body: JSON.stringify({
      from: { postal_code: soDigitos(settings.freteCepOrigem) || CEP_ORIGEM_PADRAO },
      to: { postal_code: destino },
      products,
    }),
    signal: AbortSignal.timeout(9000),
  })
  if (!r.ok) throw new Error(`Melhor Envio ${r.status}: ${(await r.text()).slice(0, 300)}`)
  const lista = await r.json()

  const soCorreios = settings.freteSoCorreios !== false
  const adicional = arred(numeroOu(settings.freteAdicional, 0))
  const prazoExtra = Math.max(0, Math.round(numeroOu(settings.fretePrazoExtra, PRAZO_EXTRA_PADRAO)))
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
