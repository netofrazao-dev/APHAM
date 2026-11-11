import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import StoryViewer from '../components/StoryViewer'
import { useStore } from '../store/StoreContext'
import Reveal from '../components/Reveal'

export default function PostsAnteriores() {
  const { stories, newsAntigas } = useStore()
  const [idx, setIdx] = useState(null)
  const nav = (dir) =>
    setIdx((i) => (i === null ? i : (i + dir + stories.length) % stories.length))

  return (
    <PageShell
      eyebrow="Mais Antigas"
      titulo="Mais Antigas da APHAM"
      descricao="Reveja os momentos que a associação já publicou — toque em um post para ver em tela cheia."
    >
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x">
          {stories.length === 0 && newsAntigas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-200 py-20 text-center text-navy-500">
              Ainda não há publicações mais antigas.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {/* Notícias que saíram do APHAM News: abrem a página da notícia */}
              {newsAntigas.map((n, i) => (
                <Reveal key={`n-${n.id}`} delay={0.04 * i}>
                  <Link
                    to={`/novidades/${encodeURIComponent(n.id)}`}
                    className="group block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-navy-100">
                      {(n.img || n.imgs?.[0]) && (
                        <img
                          src={n.img || n.imgs[0]}
                          alt={n.titulo}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        {n.tag || 'Notícia'}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        {n.data && <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-200">{n.data}</p>}
                        <p className="font-display text-sm font-bold text-white">{n.titulo}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
              {stories.map((s, i) => (
                <Reveal key={`s-${i}`} delay={0.04 * i}>
                  <button
                    type="button"
                    onClick={() => setIdx(i)}
                    className="group block w-full overflow-hidden rounded-2xl border border-navy-100 bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-navy-100">
                      <img
                        src={s.img}
                        alt={s.titulo}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                      <p className="absolute inset-x-0 bottom-0 p-3 font-display text-sm font-bold text-white">{s.titulo}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {idx !== null && (
        <StoryViewer index={idx} stories={stories} onClose={() => setIdx(null)} onNav={nav} />
      )}
    </PageShell>
  )
}
