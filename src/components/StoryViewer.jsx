import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Visualizador em tela cheia das publicações "Mais Antigas" (storys).
export default function StoryViewer({ index, stories, onClose, onNav }) {
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
  if (!s) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4" onClick={onClose}>
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
