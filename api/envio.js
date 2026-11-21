import { supabaseOk, sb, lerPedido, usuarioAdmin } from './_lib/supabase.js'
import { freteConfigurado, melhorEnvio, SERVICOS_CORREIOS, comSeguro, CEP_ORIGEM_PADRAO } from './_lib/frete.js'

// ============================================================================
//  Etiqueta do Melhor Envio direto do painel da APHAM (só admin).
//  Fluxo: preparar (põe no carrinho do Melhor Envio, ainda sem pagar) →
//  pagar (paga com o saldo da carteira, gera e devolve o link da etiqueta) →
//  imprimir / atualizar (rastreio) / cancelar. Saldo: consulta a carteira.
//  Os dados do pedido saem do banco (não do navegador). O token do Melhor Envio
//  fica só na Vercel (MELHOR_ENVIO_TOKEN) e precisa das permissões de carrinho,
//  compra, geração, impressão, rastreio, cancelamento, pedidos e saldo.
// ============================================================================

const dig = (v) => String(v ?? '').replace(/\D/g, '')
const txt = (v, max = 120) => String(v ?? '').trim().slice(0, max)
const arred = (v) => Math.round((Number(v) || 0) * 100) / 100

const ACOES = ['saldo', 'preparar', 'pagar', 'imprimir', 'atualizar', 'cancelar']

function erroLegivel(e) {
  const m = String(e?.message || e)
  if (e?.status === 401 || e?.status === 403 || /unauthori[sz]ed|scope/i.test(m)) {
    return `${m} — o token do Melhor Envio não tem permissão para isso. Crie um token novo no Melhor Envio marcando as permissões de carrinho, envios (comprar, gerar, imprimir, rastrear, cancelar), pedidos e saldo, e troque o MELHOR_ENVIO_TOKEN na Vercel (com redeploy).`
  }
  if (/saldo|balance|insufficient|insuficiente/i.test(m)) return `${m} — coloque saldo na carteira do Melhor Envio e tente de novo.`
  return m
}

async function salvar(row, patch) {
  const data = { ...row.data, ...patch, etiqueta: { ...(row.data.etiqueta || {}), ...(patch.etiqueta || {}), atualizadaEm: new Date().toISOString() } }
  await sb(`pedidos?id=eq.${encodeURIComponent(row.id)}`, { method: 'PATCH', prefer: 'return=minimal', body: { data } })
  return data
}

async function saldo() {
  try {
    const b = await melhorEnvio('/balance')
    return b && b.balance != null ? Number(b.balance) : null
  } catch {
    return null
  }
}

// Rastreio: o dos Correios (tracking) quando já existe; senão o do Melhor Envio.
async function infoEnvio(meId) {
  let o = await melhorEnvio(`/orders/${encodeURIComponent(meId)}`)
  if (Array.isArray(o)) o = o[o.length - 1]
  return {
    statusMe: o?.status || null,
    rastreio: o?.tracking || o?.self_tracking || null,
    rastreioCorreios: o?.tracking || null,
  }
}

async function gerarEImprimir(meId) {
  try {
    await melhorEnvio('/shipment/generate', { method: 'POST', body: { orders: [meId] } })
  } catch (e) {
    // Já gerada antes: segue para a impressão.
    if (!/gerad|generated|already/i.test(String(e.message))) throw e
  }
  const p = await melhorEnvio('/shipment/print', { method: 'POST', body: { mode: 'public', orders: [meId] } })
  return p?.url || null
}

function remetenteDe(settings) {
  const r = settings.remetente || {}
  const doc = dig(r.documento) || '11089865000192' // CNPJ da APHAM
  const from = {
    name: txt(r.nome || 'APHAM'),
    phone: dig(r.telefone || settings.telefone),
    email: txt(r.email || settings.email, 160),
    ...(doc.length === 14 ? { company_document: doc } : { document: doc }),
    address: txt(r.rua, 160),
    complement: txt(r.complemento, 120),
    number: txt(r.numero, 20),
    district: txt(r.bairro, 80),
    city: txt(r.cidade || 'Breves', 80),
    state_abbr: txt(r.uf || 'PA', 2).toUpperCase(),
    country_id: 'BR',
    postal_code: dig(r.cep || settings.freteCepOrigem) || CEP_ORIGEM_PADRAO,
  }
  const falta = []
  if (!from.phone) falta.push('telefone')
  if (![11, 14].includes(doc.length)) falta.push('CNPJ (ou CPF)')
  if (!from.address) falta.push('rua')
  if (!from.number) falta.push('número')
  if (!from.district) falta.push('bairro')
  return { from, falta }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })
  if (!supabaseOk()) return res.status(503).json({ ok: false, erro: 'Servidor sem Supabase configurado.' })
  if (!(await usuarioAdmin(req))) return res.status(401).json({ ok: false, erro: 'Entre no painel como administrador.' })
  if (!freteConfigurado()) return res.status(503).json({ ok: false, erro: 'Falta o MELHOR_ENVIO_TOKEN na Vercel.' })

  const acao = String(req.body?.acao || '')
  if (!ACOES.includes(acao)) return res.status(400).json({ ok: false, erro: 'Ação inválida.' })

  try {
    if (acao === 'saldo') return res.status(200).json({ ok: true, saldo: await saldo() })

    const row = await lerPedido(String(req.body?.pedidoId || ''))
    if (!row) return res.status(404).json({ ok: false, erro: 'Pedido não encontrado.' })
    const pedido = row.data
    const et = pedido.etiqueta || {}

    if (acao === 'preparar') {
      if (pedido.entrega !== 'envio') return res.status(400).json({ ok: false, erro: 'Este pedido não é de envio pelos Correios.' })
      if (et.meId && et.status !== 'cancelada') return res.status(409).json({ ok: false, erro: 'Este pedido já tem uma etiqueta. Cancele a atual antes de fazer outra.' })
      const [settingsRow] = await sb('settings?select=data&id=eq.1')
      const settings = settingsRow?.data || {}
      const { from, falta } = remetenteDe(settings)
      if (falta.length) return res.status(400).json({ ok: false, erro: `Complete o remetente em Configurações → Frete: ${falta.join(', ')}.` })

      const end = pedido.enderecoDetalhado || {}
      const cpf = dig(req.body?.cpf || pedido.cliente?.cpf)
      if (cpf.length !== 11) return res.status(400).json({ ok: false, erro: 'Informe o CPF de quem vai receber (11 números).' })
      if (dig(end.cep).length !== 8 || !end.rua || !end.cidade || !end.uf) return res.status(400).json({ ok: false, erro: 'O pedido está sem o endereço completo do cliente.' })

      const v = req.body?.volume || {}
      const volume = {
        weight: Number(v.peso),
        height: Math.ceil(Number(v.altura)),
        width: Math.ceil(Number(v.largura)),
        length: Math.ceil(Number(v.comprimento)),
      }
      if (!(volume.weight > 0 && volume.weight <= 30) || !(volume.height > 0) || !(volume.width > 0) || !(volume.length > 0)) {
        return res.status(400).json({ ok: false, erro: 'Informe o peso (até 30 kg) e as medidas do pacote.' })
      }
      const servico = dig(req.body?.servicoId || pedido.freteServicoId)
      if (!servico) return res.status(400).json({ ok: false, erro: 'Escolha o serviço (PAC ou SEDEX).' })

      const itens = pedido.itens || []
      const valorItens = arred(itens.reduce((s, i) => s + Number(i.preco) * Number(i.qtd), 0))
      const variacoes = (i) => [i.tamanho, i.modelo, i.cor, ...Object.values(i.extras || {})].filter(Boolean).join(', ')
      const body = {
        service: Number(servico),
        from,
        to: {
          name: txt(pedido.cliente?.nome),
          phone: dig(pedido.cliente?.telefone),
          email: txt(pedido.cliente?.email, 160),
          document: cpf,
          address: txt(end.rua, 160),
          complement: txt(end.complemento, 120),
          number: txt(end.numero || 's/n', 20),
          district: txt(end.bairro || 'N/I', 80),
          city: txt(end.cidade, 80),
          state_abbr: txt(end.uf, 2).toUpperCase(),
          country_id: 'BR',
          postal_code: dig(end.cep),
        },
        products: itens.map((i) => ({
          name: txt(`${i.nome}${variacoes(i) ? ` (${variacoes(i)})` : ''}`, 120),
          quantity: Number(i.qtd) || 1,
          unitary_value: arred(i.preco),
        })),
        volumes: SERVICOS_CORREIOS.includes(servico) ? volume : [volume],
        options: {
          insurance_value: comSeguro(settings) ? valorItens : 0,
          receipt: false,
          own_hand: false,
          reverse: false,
          non_commercial: true, // declaração de conteúdo (sem nota fiscal)
          platform: 'Loja APHAM',
          tags: [{ tag: pedido.numero }],
        },
      }
      const r = await melhorEnvio('/cart', { method: 'POST', body })
      if (!r?.id) throw new Error('O Melhor Envio não devolveu o envio criado.')
      const data = await salvar(row, {
        ...(cpf !== dig(pedido.cliente?.cpf) ? { cliente: { ...pedido.cliente, cpf } } : {}),
        etiqueta: {
          meId: r.id,
          protocolo: r.protocol || null,
          preco: r.price != null ? arred(r.price) : null,
          servicoId: servico,
          status: 'carrinho',
          volume: { peso: volume.weight, altura: volume.height, largura: volume.width, comprimento: volume.length },
          criadaEm: new Date().toISOString(),
          url: null,
          rastreio: null,
          statusMe: null,
          pagaEm: null,
          canceladaEm: null,
        },
      })
      return res.status(200).json({ ok: true, pedido: data, saldo: await saldo() })
    }

    if (!et.meId || et.status === 'cancelada') return res.status(400).json({ ok: false, erro: 'Este pedido ainda não tem etiqueta.' })

    if (acao === 'pagar') {
      if (et.status !== 'carrinho') return res.status(409).json({ ok: false, erro: 'Esta etiqueta já foi paga.' })
      await melhorEnvio('/shipment/checkout', { method: 'POST', body: { orders: [et.meId], ...(et.preco ? { wallet: et.preco } : {}) } })
      let data = await salvar(row, { etiqueta: { status: 'paga', pagaEm: new Date().toISOString() } })
      // Gera e imprime logo em seguida; se o Melhor Envio demorar, o botão
      // "Imprimir etiqueta" tenta de novo.
      let aviso = ''
      try {
        const url = await gerarEImprimir(et.meId)
        const info = await infoEnvio(et.meId).catch(() => ({}))
        data = await salvar({ ...row, data }, { etiqueta: { status: 'gerada', url, ...(info.rastreio ? { rastreio: info.rastreio, statusMe: info.statusMe } : {}) } })
      } catch (e) {
        aviso = `Etiqueta paga, mas ainda não ficou pronta para imprimir (${erroLegivel(e)}). Clique em “Imprimir etiqueta” daqui a pouco.`
      }
      return res.status(200).json({ ok: true, pedido: data, aviso, saldo: await saldo() })
    }

    if (acao === 'imprimir') {
      if (et.status === 'carrinho') return res.status(409).json({ ok: false, erro: 'Pague a etiqueta primeiro.' })
      const url = await gerarEImprimir(et.meId)
      const info = await infoEnvio(et.meId).catch(() => ({}))
      const data = await salvar(row, { etiqueta: { status: 'gerada', url, ...(info.rastreio ? { rastreio: info.rastreio, statusMe: info.statusMe } : {}) } })
      return res.status(200).json({ ok: true, pedido: data })
    }

    if (acao === 'atualizar') {
      const info = await infoEnvio(et.meId)
      const data = await salvar(row, { etiqueta: { ...(info.rastreio ? { rastreio: info.rastreio } : {}), statusMe: info.statusMe } })
      return res.status(200).json({ ok: true, pedido: data })
    }

    if (acao === 'cancelar') {
      if (et.status === 'carrinho') {
        await melhorEnvio(`/cart/${encodeURIComponent(et.meId)}`, { method: 'DELETE' })
      } else {
        // Paga/gerada e ainda não postada: o Melhor Envio devolve o valor ao saldo.
        await melhorEnvio('/shipment/cancel', {
          method: 'POST',
          body: { order: { id: et.meId, reason_id: '2', description: 'Cancelado pela APHAM' } },
        })
      }
      const data = await salvar(row, { etiqueta: { status: 'cancelada', canceladaEm: new Date().toISOString() } })
      return res.status(200).json({ ok: true, pedido: data, saldo: await saldo() })
    }
  } catch (e) {
    console.error('envio', acao, e)
    return res.status(502).json({ ok: false, erro: erroLegivel(e) })
  }
}
