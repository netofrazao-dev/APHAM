const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(v) {
  return brl.format(Number(v) || 0)
}

// Preço final considerando promoção.
export function precoFinal(p) {
  return p.precoPromo != null && p.precoPromo !== '' ? Number(p.precoPromo) : Number(p.preco)
}
