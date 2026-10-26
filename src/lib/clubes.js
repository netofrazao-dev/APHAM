import { clubes as clubesSeed } from '../data/content'

// Endereço da página do time a partir do nome ("União Handebol" → "uniao-handebol").
export function slugTime(nome) {
  return (nome || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Times do painel (settings.clubes) ou do código, completando com os campos do
// código (cores, lema, cidade…) quando o time salvo no painel não os tiver.
export function listarClubes(settings) {
  const base = settings?.clubes ?? clubesSeed
  return base.map((c) => {
    const seed = clubesSeed.find((s) => slugTime(s.nome) === slugTime(c.nome)) || {}
    const vazio = (v) => v == null || v === '' || (Array.isArray(v) && !v.length)
    const t = { ...seed }
    for (const [k, v] of Object.entries(c)) if (!vazio(v) || !(k in seed)) t[k] = v
    return { ...t, slug: slugTime(t.nome) }
  })
}

// Jogos transmitidos (Lives) em que o time aparece no título, com o adversário.
export function jogosDoTime(lives, nome) {
  const alvo = slugTime(nome)
  return (lives || [])
    .map((j) => {
      const semFase = j.titulo.replace(/^[^—]*—\s*/, '') // "Final — Bulls x Canibal" → "Bulls x Canibal"
      const lados = semFase.split(/\s+x\s+/i)
      if (lados.length !== 2) return null
      const i = lados.findIndex((l) => slugTime(l).split('-').includes(alvo) || slugTime(l) === alvo)
      if (i < 0) return null
      const fase = j.titulo.includes('—') ? j.titulo.split('—')[0].trim() : ''
      return { ...j, adversario: lados[1 - i].replace(/\s*\(.*\)\s*$/, '').trim(), fase }
    })
    .filter(Boolean)
}
