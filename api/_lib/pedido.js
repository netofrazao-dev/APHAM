import crypto from 'node:crypto'
import { sb, emLista } from './supabase.js'

// ============================================================================
//  Pedidos da loja pagos pelo site (Mercado Pago).
//  O servidor refaz TODOS os valores a partir do banco (preço, promoção,
//  comissão das lojas parceiras, cupom e entrega): o que vem do navegador é só
//  "qual produto, tamanho, cor e quantidade". As regras de preço são as mesmas
//  de src/store/format.js, src/store/lojas.js e do checkout.
// ============================================================================

const arred = (v) => Math.round((Number(v) || 0) * 100) / 100
const precoFinal = (p) => (p.precoPromo != null && p.precoPromo !== '' ? Number(p.precoPromo) : Number(p.preco))
const comissaoPct = (s) => {
  const v = Number(s?.comissaoLojas)
  return Number.isFinite(v) && v >= 0 ? v : 10
}
const texto = (v, max) => String(v ?? '').trim().slice(0, max)

export async function montarPedido(entrada) {
  const itensIn = Array.isArray(entrada.itens) ? entrada.itens.slice(0, 50) : []
  if (!itensIn.length) return { erro: 'Carrinho vazio.' }
  const cliente = {
    nome: texto(entrada.cliente?.nome, 120),
    telefone: texto(entrada.cliente?.telefone, 40),
    email: texto(entrada.cliente?.email, 160),
  }
  if (!cliente.nome || !cliente.telefone) return { erro: 'Informe nome e telefone.' }
  if (!/^\S+@\S+\.\S+$/.test(cliente.email)) return { erro: 'Informe um e-mail válido para o pagamento.' }

  const ids = [...new Set(itensIn.map((i) => texto(i.id, 120)).filter(Boolean))]
  const [produtosRows, settingsRows, cuponsRows] = await Promise.all([
    sb(`produtos?select=id,data&id=in.${emLista(ids)}`),
    sb('settings?select=data&id=eq.1'),
    entrada.cupom ? sb('cupons?select=data') : Promise.resolve([]),
  ])
  const settings = settingsRows?.[0]?.data || {}
  const produtos = Object.fromEntries(produtosRows.map((r) => [r.id, { ...r.data, id: r.id }]))
  const lojaIds = [...new Set(Object.values(produtos).map((p) => p.lojaId).filter(Boolean))]
  const lojas = lojaIds.length
    ? Object.fromEntries((await sb(`lojas?select=id,status,data&id=in.${emLista(lojaIds)}`)).map((l) => [l.id, l]))
    : {}
  const pct = comissaoPct(settings)

  const itens = []
  const porProduto = {}
  for (const i of itensIn) {
    const p = produtos[texto(i.id, 120)]
    const qtd = Math.floor(Number(i.qtd))
    if (!p || p.ativo === false) return { erro: 'Um dos produtos não está mais disponível. Atualize o carrinho.' }
    if (!(qtd >= 1 && qtd <= 99)) return { erro: 'Quantidade inválida.' }
    const loja = p.lojaId ? lojas[p.lojaId] : null
    if (p.lojaId && loja?.status !== 'aprovada') return { erro: `“${p.nome}” não está mais à venda.` }
    porProduto[p.id] = (porProduto[p.id] || 0) + qtd
    if (p.estoque != null && porProduto[p.id] > Number(p.estoque)) return { erro: `Estoque insuficiente de “${p.nome}”.` }
    const tamanho = texto(i.tamanho, 20)
    const cor = texto(i.cor, 40)
    if (tamanho && p.tamanhos?.length && !p.tamanhos.includes(tamanho)) return { erro: `Tamanho inválido em “${p.nome}”.` }
    if (cor && p.cores?.length && !p.cores.includes(cor)) return { erro: `Cor inválida em “${p.nome}”.` }
    const base = arred(precoFinal(p))
    itens.push({
      id: p.id,
      nome: p.nome,
      preco: p.lojaId ? arred(base * (1 + pct / 100)) : base,
      imagem: p.imagens?.[0] || '',
      tamanho,
      cor,
      qtd,
      ...(p.lojaId ? { lojaId: p.lojaId, lojaNome: loja?.data?.nome || '', precoLojista: base, comissaoPct: pct } : {}),
    })
  }

  const subtotal = arred(itens.reduce((s, i) => s + i.preco * i.qtd, 0))
  let desconto = 0
  let cupomCodigo = ''
  if (entrada.cupom) {
    const c = cuponsRows
      .map((r) => r.data)
      .find((x) => x.ativo && (x.codigo || '').toLowerCase() === texto(entrada.cupom, 40).toLowerCase())
    if (!c) return { erro: 'Cupom inválido ou inativo.' }
    if (subtotal < (Number(c.minimo) || 0)) return { erro: 'Pedido mínimo não atingido para este cupom.' }
    desconto = arred(c.tipo === 'percent' ? (subtotal * Number(c.valor)) / 100 : Math.min(Number(c.valor), subtotal))
    cupomCodigo = c.codigo
  }
  const entrega = entrada.entrega === 'entrega' ? 'entrega' : 'retirada'
  let frete = 0
  if (entrega === 'entrega') {
    const gratis = settings.entregaGratisAcima
    frete = gratis != null && gratis !== '' && subtotal >= Number(gratis) ? 0 : arred(settings.entregaTaxa)
  }
  const total = arred(Math.max(0, subtotal - desconto) + frete)
  if (total < 1) return { erro: 'Valor do pedido muito baixo para pagamento online.' }

  const pedido = {
    id: crypto.randomUUID(),
    numero: 'APHAM-' + Date.now().toString().slice(-6) + crypto.randomInt(10, 99),
    data: new Date().toISOString(),
    cliente,
    itens,
    subtotal,
    desconto,
    cupomCodigo,
    frete,
    total,
    entrega,
    endereco: entrega === 'entrega' ? texto(entrada.endereco, 300) : '',
    pagamento: 'online',
    pagamentoOnline: { status: 'aguardando' },
    obs: texto(entrada.obs, 1000),
    status: 'recebido',
  }
  return { pedido, lojaIds }
}

export async function salvarPedido(pedido, lojaIds = []) {
  await sb('pedidos', {
    method: 'POST',
    prefer: 'return=minimal',
    body: { id: pedido.id, numero: pedido.numero, status: pedido.status, data: pedido, ...(lojaIds.length ? { lojas: lojaIds } : {}) },
  })
}

// Aplica uma order do Mercado Pago (já resumida por normalizarOrder) ao pedido.
// Usado ao pagar, no aviso do Mercado Pago e na consulta de status.
// Pagamento aprovado → pedido "confirmado" (a mesma etapa que a APHAM marcava à
// mão). Idempotente: o estoque só baixa uma vez.
export async function aplicarPagamento(row, mp) {
  const pedido = row.data
  if (mp.referencia !== row.id) return row
  const status = mp.status
  const anterior = pedido.pagamentoOnline || {}
  // Não deixa uma tentativa recusada/antiga sobrescrever uma já aprovada.
  if (anterior.status === 'aprovado' && String(anterior.id) !== String(mp.id)) return row
  const valorOk = mp.valor >= Number(pedido.total) - 0.01
  const aprovado = status === 'aprovado' && valorOk

  const novo = {
    ...pedido,
    pagamentoOnline: {
      ...anterior,
      id: mp.id,
      status: aprovado || status !== 'aprovado' ? status : 'em_analise',
      metodo: mp.metodo,
      tipo: mp.tipo,
      parcelas: mp.parcelas,
      atualizadoEm: new Date().toISOString(),
    },
  }
  let statusPedido = row.status
  if (aprovado && row.status === 'recebido') statusPedido = 'confirmado'
  if (status === 'estornado' && row.status !== 'cancelado') statusPedido = 'cancelado'
  novo.status = statusPedido

  const primeiraAprovacao = aprovado && !pedido.estoqueBaixado
  if (primeiraAprovacao) novo.estoqueBaixado = true
  await sb(`pedidos?id=eq.${encodeURIComponent(row.id)}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: { status: statusPedido, data: novo },
  })
  if (primeiraAprovacao) {
    await baixarEstoque(pedido.itens).catch(() => {})
    await avisarAprovado(novo).catch(() => {})
  }
  return { ...row, status: statusPedido, data: novo }
}

async function baixarEstoque(itens) {
  const qtd = {}
  for (const i of itens) qtd[i.id] = (qtd[i.id] || 0) + i.qtd
  const rows = await sb(`produtos?select=id,data&id=in.${emLista(Object.keys(qtd))}`)
  await Promise.all(
    rows
      .filter((r) => r.data.estoque != null)
      .map((r) =>
        sb(`produtos?id=eq.${encodeURIComponent(r.id)}`, {
          method: 'PATCH',
          prefer: 'return=minimal',
          body: { data: { ...r.data, estoque: Math.max(0, Number(r.data.estoque) - qtd[r.id]) } },
        })
      )
  )
}

// E-mail para a APHAM quando um pagamento é aprovado (se o Resend estiver configurado).
async function avisarAprovado(p) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  if (!key || !to) return
  const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const linhas = p.itens.map((i) => `• ${i.qtd}x ${i.nome}${i.tamanho || i.cor ? ` (${[i.tamanho, i.cor].filter(Boolean).join(', ')})` : ''} — ${brl(i.preco * i.qtd)}`)
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || 'APHAM <onboarding@resend.dev>',
      to,
      subject: `Pagamento aprovado — pedido ${p.numero} — ${brl(p.total)}`,
      text: [
        `Pagamento aprovado pelo Mercado Pago (${p.pagamentoOnline.metodo}).`,
        `Pedido: ${p.numero}`,
        '',
        ...linhas,
        '',
        `Total: ${brl(p.total)}`,
        `Cliente: ${p.cliente.nome} · ${p.cliente.telefone} · ${p.cliente.email}`,
        `Entrega: ${p.entrega === 'entrega' ? `Entrega — ${p.endereco}` : 'Retirada'}`,
        p.obs ? `Obs: ${p.obs}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    }),
  })
}

// O que o navegador pode saber do pedido (sem dados de outras pessoas).
export const resumoPublico = (row) => ({
  id: row.id,
  numero: row.numero,
  status: row.status,
  pagamento: row.data.pagamentoOnline?.status || null,
})
