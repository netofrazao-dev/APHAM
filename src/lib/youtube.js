// Extrai o ID de um vídeo do YouTube a partir de vários formatos de link:
//  youtu.be/ID · youtube.com/watch?v=ID · /live/ID · /embed/ID · /shorts/ID
export function youtubeId(url) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /\/live\/([a-zA-Z0-9_-]{11})/, // /live/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/, // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // /shorts/ID
  ]
  for (const re of patterns) {
    const m = u.match(re)
    if (m) return m[1]
  }
  // Se o próprio texto já for só o ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u
  return null
}

// Monta a URL de embed (ou null se não der para reconhecer o link).
export function youtubeEmbed(url, { autoplay = false } = {}) {
  const id = youtubeId(url)
  if (!id) return null
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

// Título de um vídeo do YouTube (para jogos cadastrados só com o link). Tenta o
// oEmbed do YouTube e, se o navegador bloquear, o noembed.com. Guarda no
// aparelho para não buscar de novo.
export async function tituloYoutube(id) {
  const chave = `apham:ytTitulo:${id}`
  try {
    const salvo = localStorage.getItem(chave)
    if (salvo) return salvo
  } catch {
    /* sem localStorage */
  }
  const url = encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)
  for (const fonte of [`https://www.youtube.com/oembed?format=json&url=${url}`, `https://noembed.com/embed?url=${url}`]) {
    try {
      const r = await fetch(fonte)
      if (!r.ok) continue
      const j = await r.json()
      if (j?.title) {
        try {
          localStorage.setItem(chave, j.title)
        } catch {
          /* ignora */
        }
        return j.title
      }
    } catch {
      /* tenta a próxima fonte */
    }
  }
  return ''
}
