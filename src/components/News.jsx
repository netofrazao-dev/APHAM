import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'
import { site } from '../data/content'
import { useStore } from '../store/StoreContext'
import Reveal from './Reveal'

function StoryViewer({ index, stories, onClose, onNav }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNav])

  const s = stories[index]
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4" onClick={onClose}>
      {/* barras de progresso */}
      <div className="absolute left-1/2 top-4 flex w-full max-w-sm -translate-x-1/2 gap-1 px-4">
        {stories.map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-cyan-400' : 'bg-white/25'}`} />
        ))}
      </div>
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute right-4 top-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <X className="h-5 w-5" />
      </button>
      <button type="button" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); onNav(-1) }} className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <figure className="max-h-[85vh] w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <img src={s.img} alt={s.titulo} className="max-h-[80vh] w-full rounded-2xl object-cover" />
        <figcaption className="mt-3 text-center font-display text-base font-semibold text-white">{s.titulo}</figcaption>
      </figure>
      <button type="button" aria-label="Próximo" onClick={(e) => { e.stopPropagation(); onNav(1) }} className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

export default function News() {
  const { novidades, stories } = useStore()
  const [storyIdx, setStoryIdx] = useState(null)
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
    : novidades.map((n) => ({ ...n, link: null }))
  const nav = (dir) =>
    setStoryIdx((i) => (i === null ? i : (i + dir + stories.length) % stories.length))

  return (
    <section id="novidades" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-cyan-400" />
              Novidades
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              O que está acontecendo na APHAM
            </h2>
            <p className="mt-4 text-ink/70">
              Momentos dos campeonatos, treinos e ações — publicados pela associação.
            </p>
          </Reveal>
          <Reveal>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Instagram className="h-4 w-4" />
              Siga no Instagram
            </a>
          </Reveal>
        </div>

        {/* Stories */}
        <Reveal>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-3">
            {stories.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStoryIdx(i)}
                className="group flex shrink-0 flex-col items-center gap-2"
              >
                <span className="rounded-full bg-gradient-to-tr from-cyan-500 to-navy-500 p-[3px]">
                  <span className="block rounded-full bg-paper p-[3px]">
                    <img src={s.img} alt={s.titulo} loading="lazy" decoding="async" className="h-20 w-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </span>
                </span>
                <span className="max-w-[88px] truncate text-xs font-medium text-navy-700">{s.titulo}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Feed de novidades (Instagram quando disponível) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {feed.map((n, i) => {
            const Card = n.link ? 'a' : 'article'
            const linkProps = n.link
              ? { href: n.link, target: '_blank', rel: 'noopener noreferrer' }
              : {}
            return (
              <Reveal key={n.id || i} delay={0.06 * i}>
                <Card
                  {...linkProps}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {n.img && (
                      <img src={n.img} alt={n.titulo} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    {n.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">{n.tag}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {n.data && <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600">{n.data}</span>}
                    <h3 className="mt-1 font-display text-lg font-bold text-navy-900">{n.titulo}</h3>
                    {n.texto && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{n.texto}</p>}
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>

      {storyIdx !== null && (
        <StoryViewer index={storyIdx} stories={stories} onClose={() => setStoryIdx(null)} onNav={nav} />
      )}
    </section>
  )
}
