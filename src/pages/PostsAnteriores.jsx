import { useState } from 'react'
import PageShell from '../components/PageShell'
import StoryViewer from '../components/StoryViewer'
import { useStore } from '../store/StoreContext'
import Reveal from '../components/Reveal'

export default function PostsAnteriores() {
  const { stories } = useStore()
  const [idx, setIdx] = useState(null)
  const nav = (dir) =>
    setIdx((i) => (i === null ? i : (i + dir + stories.length) % stories.length))

  return (
    <PageShell
      eyebrow="Posts anteriores"
      titulo="Posts anteriores da APHAM"
      descricao="Reveja os momentos que a associação já publicou — toque em um post para ver em tela cheia."
    >
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x">
          {stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-200 py-20 text-center text-navy-500">
              Ainda não há posts anteriores.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {stories.map((s, i) => (
                <Reveal key={i} delay={0.04 * i}>
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
