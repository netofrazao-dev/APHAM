import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Fotos em tela cheia: setas, teclado, deslizar no celular e faixa de miniaturas.
// itens: [{ img, mini, legenda, grupo }] — `grupo` aparece ao lado do contador.
export default function Lightbox({ itens, idx, onChange, onClose }) {
  const total = itens.length
  const atual = itens[idx]
  const toqueX = useRef(null)
  const faixa = useRef(null)
  const ir = (d) => onChange((idx + d + total) % total)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((idx + 1) % total)
      if (e.key === 'ArrowLeft') onChange((idx - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, total, onChange, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Pré-carrega as vizinhas e centraliza a miniatura atual na faixa.
  useEffect(() => {
    ;[1, -1].forEach((d) => {
      const im = new Image()
      im.src = itens[(idx + d + total) % total].img
    })
    const el = faixa.current?.querySelector(`[data-i="${idx}"]`)
    if (el) faixa.current.scrollTo({ left: el.offsetLeft - faixa.current.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [idx, itens, total])

  const parar = (e) => e.stopPropagation()

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={atual.legenda}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6" onClick={parar}>
        <p className="min-w-0 truncate text-sm">
          <span className="font-semibold tabular-nums">
            {idx + 1} / {total}
          </span>
          {atual.grupo && <span className="ml-3 text-white/60">{atual.grupo}</span>}
        </p>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="Fechar"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20"
        onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toqueX.current == null) return
          const dx = e.changedTouches[0].clientX - toqueX.current
          toqueX.current = null
          if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1)
        }}
      >
        <motion.img
          key={idx}
          src={atual.img}
          alt={atual.legenda}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={parar}
          className="max-h-full max-w-full select-none rounded-xl object-contain shadow-lift"
          draggable={false}
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5 sm:h-12 sm:w-12"
              aria-label="Foto anterior"
              onClick={(e) => {
                parar(e)
                ir(-1)
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5 sm:h-12 sm:w-12"
              aria-label="Próxima foto"
              onClick={(e) => {
                parar(e)
                ir(1)
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <p className="px-6 pb-5 pt-4 text-center text-sm text-white/85 sm:pb-3" onClick={parar}>
        {atual.legenda}
      </p>

      {total > 1 && (
        <div ref={faixa} className="hidden overflow-x-auto px-4 pb-4 sm:block" onClick={parar}>
          <div className="mx-auto flex w-max gap-2">
            {itens.map((f, i) => (
              <button
                key={f.img}
                type="button"
                data-i={i}
                onClick={() => onChange(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                  i === idx ? 'opacity-100 ring-cyan-400' : 'opacity-45 ring-transparent hover:opacity-90'
                }`}
              >
                <img src={f.mini || f.img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
