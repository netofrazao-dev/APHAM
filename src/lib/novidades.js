// APHAM News × Mais Antigas. O News mostra as N novidades mais recentes (as do
// topo da lista do painel); as que passam disso, e as que o admin mandou para lá
// ("arquivada"), aparecem em "Mais Antigas". A quantidade fica em Configurações
// da loja/site (settings.newsQuantidade) e é editada no painel de Novidades.
export const NEWS_QTD_PADRAO = 6

export const qtdNews = (settings) => {
  const v = Math.floor(Number(settings?.newsQuantidade))
  return v > 0 ? v : NEWS_QTD_PADRAO
}

export function dividirNovidades(novidades = [], qtd = NEWS_QTD_PADRAO) {
  const ordenadas = [...novidades].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
  const ativas = ordenadas.filter((n) => !n.arquivada)
  return {
    noNews: ativas.slice(0, qtd),
    antigas: [...ativas.slice(qtd), ...ordenadas.filter((n) => n.arquivada)],
  }
}
