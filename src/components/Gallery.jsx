import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { galeria } from '../data/content'
import Reveal from './Reveal'

export default function Gallery() {
  const [idx, setIdx] = useState(null)
  const open = idx !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIdx(null)
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % galeria.length)
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + galeria.length) % galeria.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section id="galeria" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Galeria
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            A APHAM em imagens
          </h2>
          <p className="mt-4 text-ink/70">
            Momentos de quadra, formação e ação social que contam a nossa história.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {galeria.map((g, i) => (
            <Reveal key={i} delay={0.04 * i}>
              <button
                type="button"
                onClick={() => setIdx(i)}
                className={`group relative block w-full overflow-hidden rounded-2xl shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={g.img}
                  alt={g.legenda}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    i % 5 === 0 ? 'aspect-square md:h-full' : 'aspect-[4/3]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-2 text-sm font-semibold text-white opacity-0 drop-shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.legenda}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
          onClick={() => setIdx(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Fechar"
            onClick={() => setIdx(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation()
              setIdx((i) => (i - 1 + galeria.length) % galeria.length)
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={galeria[idx].img}
              alt={galeria[idx].legenda}
              className="max-h-[78vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {galeria[idx].legenda}
            </figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Próxima"
            onClick={(e) => {
              e.stopPropagation()
              setIdx((i) => (i + 1) % galeria.length)
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  )
}
