import { precoFinal } from './format'

// ============================================================================
//  Lojas parceiras: preço com a parte da APHAM, slug da loja e financeiro.
//  O lojista cadastra o preço que ele quer receber; na vitrine aparece esse
//  preço + a comissão da APHAM (% único, em Configurações do painel).
// ============================================================================

export const COMISSAO_PADRAO = 10
export const comissaoPct = (settings) => {
  const v = Number(settings?.comissaoLojas)
  return Number.isFinite(v) && v >= 0 ? v : COMISSAO_PADRAO
}

export const arred = (v) => Math.round((Number(v) || 0) * 100) / 100

const comComissao = (valor, produto, pct) => (produto?.lojaId ? arred(valor * (1 + pct / 100)) : arred(valor))

// Preço que o cliente paga (com promoção e com a parte da APHAM, se for de loja parceira).
export const precoVitrine = (p, pct) => comComissao(precoFinal(p), p, pct)
// Preço "de" (sem promoção), para o riscado.
export const precoCheioVitrine = (p, pct) => comComissao(Number(p.preco), p, pct)

export function slugLoja(nome) {
  return (nome || 'loja')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
export const urlLoja = (l) => `/loja/lojas/${l.slug || slugLoja(l.nome)}`

// Item do carrinho de um produto (guarda o valor do lojista e a comissão do momento).
export function itemCarrinho(produto, pct, extra = {}) {
  const base = {
    id: produto.id,
    nome: produto.nome,
    preco: precoVitrine(produto, pct),
    imagem: produto.imagens?.[0] || '',
    tamanho: '',
    cor: '',
    qtd: 1,
    ...extra,
  }
  if (!produto.lojaId) return base
  return { ...base, lojaId: produto.lojaId, lojaNome: produto.lojaNome || '', precoLojista: arred(precoFinal(produto)), comissaoPct: pct }
}

// Pedidos que contam para o repasse: pagamento confirmado em diante.
export const STATUS_PAGOS = ['confirmado', 'preparo', 'rota', 'entregue']

// Vendas de uma loja: total pago pelo cliente, parte do lojista e parte da APHAM.
export function vendasDaLoja(pedidos, lojaId) {
  let cliente = 0
  let lojista = 0
  let qtd = 0
  const lista = []
  for (const o of pedidos || []) {
    const itens = (o.itens || []).filter((i) => i.lojaId === lojaId)
    if (!itens.length) continue
    const pago = STATUS_PAGOS.includes(o.status)
    const c = itens.reduce((s, i) => s + i.preco * i.qtd, 0)
    const l = itens.reduce((s, i) => s + (i.precoLojista ?? i.preco) * i.qtd, 0)
    lista.push({ pedido: o, itens, cliente: arred(c), lojista: arred(l), pago })
    if (pago) {
      cliente += c
      lojista += l
      qtd++
    }
  }
  return { pedidos: lista, qtdPagos: qtd, cliente: arred(cliente), lojista: arred(lojista), apham: arred(cliente - lojista) }
}

export function saldoDaLoja(pedidos, repasses, lojaId) {
  const v = vendasDaLoja(pedidos, lojaId)
  const repassado = arred((repasses || []).filter((r) => r.lojaId === lojaId).reduce((s, r) => s + Number(r.valor), 0))
  return { ...v, repassado, aReceber: arred(v.lojista - repassado) }
}

export const STATUS_LOJA = {
  pendente: { label: 'Em análise', cor: 'bg-amber-100 text-amber-800' },
  aprovada: { label: 'Aprovada', cor: 'bg-emerald-100 text-emerald-700' },
  recusada: { label: 'Recusada', cor: 'bg-red-100 text-red-700' },
  suspensa: { label: 'Suspensa', cor: 'bg-navy-100 text-navy-700' },
}
