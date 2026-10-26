import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, PlayCircle, ArrowUpRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import Reveal from './Reveal'
import Stories from './Stories'

// Mídia do card: uma foto, ou duas (ou mais) que se alternam com efeito de
// transição (crossfade). Use `imgs: [a, b]` na novidade para o efeito de 2 fotos.
function CardMedia({ item }) {
  const imgs = Array.isArray(item.imgs) && item.imgs.length > 1 ? item.imgs : null
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!imgs) return
    const id = setInterval(() => setIdx((p) => (p + 1) % imgs.length), 3000)
    return () => clearInterval(id)
  }, [imgs])

  if (imgs) {
    return (
      <>
        {imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={item.titulo}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out group-hover:scale-105"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
      </>
    )
  }

  return (
    item.img && (
      <img src={item.img} alt={item.titulo} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    )
  )
}

export default function News() {
  const { novidades, settings } = useStore()
  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const [igPosts, setIgPosts] = useState([])

  // Tenta buscar os posts do Instagram (via /api/instagram). Se não houver
  // (ainda sem token ou em desenvolvimento), usa as novidades do painel.
  useEffect(() => {
    let alive = true
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.ok && Array.isArray(d.posts) && d.posts.length) setIgPosts(d.posts)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // Feed unificado: Instagram quando disponível, senão novidades do painel.
  const feed = igPosts.length
    ? igPosts.map((p) => ({
        id: p.id,
        img: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
        tag: 'Instagram',
        data: p.timestamp ? new Date(p.timestamp).toLocaleDateString('pt-BR') : '',
        titulo: (p.caption || 'Post no Instagram').split('\n')[0].slice(0, 80),
        texto: (p.caption || '').slice(0, 160),
        link: p.permalink,
      }))
    : [...novidades].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)).map((n) => ({ ...n, link: null }))

  return (
    <section id="novidades" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            APHAM News
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            O que está acontecendo na APHAM
          </h2>
          <p className="mt-4 text-ink/70">
            Momentos dos campeonatos, treinos e ações — publicados pela associação.
          </p>
        </Reveal>

        {/* Destaque de transmissão ao vivo (quando o admin ativa) */}
        {aoVivo && (
          <Reveal>
            <a
              href="#lives"
              className="group mt-8 flex flex-col items-start gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-red-600 p-5 shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex items-center gap-4">
                <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                  <Radio className="h-6 w-6" />
                </span>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    Ao vivo agora
                  </span>
                  <p className="mt-1.5 font-display text-lg font-bold text-white">
                    {settings.aoVivoTitulo || 'APHAM ao vivo'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-700 transition-transform duration-300 group-hover:scale-105">
                <PlayCircle className="h-4 w-4" />
                Assistir agora
              </span>
            </a>
          </Reveal>
        )}

        {/* Feed de novidades (APHAM NEWS) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {feed.map((n, i) => {
            // Instagram abre o post; as notícias do painel abrem a própria página.
            const Card = n.link ? 'a' : Link
            const linkProps = n.link
              ? { href: n.link, target: '_blank', rel: 'noopener noreferrer' }
              : { to: `/novidades/${encodeURIComponent(n.id)}` }
            const temSombra = n.sombra !== false // sombra ligada por padrão
            return (
              <Reveal key={n.id || i} delay={0.06 * i}>
                <Card
                  {...linkProps}
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    temSombra ? 'border-navy-100 shadow-lift hover:-translate-y-1' : 'border-navy-200 hover:-translate-y-1'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <CardMedia item={n} />
                    {n.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">{n.tag}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {n.data && <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600">{n.data}</span>}
                    <h3 className="mt-1 font-display text-lg font-bold text-navy-900">{n.titulo}</h3>
                    {(n.resumo || n.texto) && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70 line-clamp-3">{n.resumo || n.texto}</p>}
                    <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-cyan-700 transition-colors group-hover:text-cyan-800">
                      {n.link ? 'Ver no Instagram' : 'Ler notícia'} <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>

        {/* Mais Antigas (os "storys" salvos) — depois dos cards */}
        <div className="mt-16">
          <Stories titulo="Mais Antigas" subtitulo="Reveja os posts que a APHAM já publicou — toque para ver em tela cheia." />
        </div>
      </div>

    </section>
  )
}
