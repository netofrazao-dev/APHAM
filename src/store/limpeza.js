// Remove avisos de "conteúdo provisório" que foram copiados para o banco
// (Supabase) quando o painel foi usado pela primeira vez, antes de esses
// avisos saírem do código. Usado ao carregar os dados (visitantes) e, com o
// admin logado, para corrigir o próprio banco.

const NOTA_NOVIDADE = /\s*\((?:texto|conteúdo) provisório[^)]*\)/gi
const HISTORIA_PROVISORIA = /^\s*conteúdo provisório/i

export function limparNovidade(n) {
  if (!n || typeof n.texto !== 'string' || !NOTA_NOVIDADE.test(n.texto)) return n
  NOTA_NOVIDADE.lastIndex = 0
  return { ...n, texto: n.texto.replace(NOTA_NOVIDADE, '').trim() }
}

export function limparSettings(s) {
  if (!s || !Array.isArray(s.clubes)) return s
  if (!s.clubes.some((c) => HISTORIA_PROVISORIA.test(c?.historia || ''))) return s
  return {
    ...s,
    clubes: s.clubes.map((c) => (HISTORIA_PROVISORIA.test(c?.historia || '') ? { ...c, historia: '' } : c)),
  }
}
