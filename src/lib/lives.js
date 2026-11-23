// Categorias das Lives (ex.: TFA, Copa Handebol, Jogos Escolares). Cada jogo
// guarda o nome da categoria no campo `torneio`. A ordem e a lista ficam em
// settings.livesCategorias (painel → Lives APHAM); antes de existir, vale a
// ordem em que as categorias aparecem nos jogos. Jogos com uma categoria que não
// está na lista aparecem depois, para nenhum sumir do site.

const unicos = (lista) => [...new Set(lista.map((s) => String(s || '').trim()).filter(Boolean))]

export function categoriasLives(settings, lives = []) {
  const salvas = Array.isArray(settings?.livesCategorias) ? unicos(settings.livesCategorias) : null
  const dosJogos = unicos(lives.map((j) => j.torneio))
  if (!salvas) return dosJogos
  return [...salvas, ...dosJogos.filter((c) => !salvas.includes(c))]
}

// Jogos agrupados pela ordem das categorias: [{ nome, jogos }]. Sem categoria vai
// para "Outros jogos", no fim.
export function livesPorCategoria(settings, lives = []) {
  const grupos = categoriasLives(settings, lives).map((nome) => ({ nome, jogos: [] }))
  const outros = { nome: 'Outros jogos', jogos: [] }
  for (const j of lives) {
    const g = grupos.find((x) => x.nome === String(j.torneio || '').trim())
    ;(g || outros).jogos.push(j)
  }
  return [...grupos, outros].filter((g) => g.jogos.length)
}
