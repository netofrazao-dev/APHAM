import { useEffect, useState } from 'react'
import { Play, X, Clock, Film } from 'lucide-react'
import { videos } from '../data/content'
import Reveal from './Reveal'

function VideoModal({ video, onClose }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Fechar"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {!failed ? (
          <video
            src={video.arquivo}
            poster={video.poster}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            onError={() => setFailed(true)}
            className="aspect-video w-full rounded-xl bg-black shadow-lift"
          />
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lift">
            <img src={video.poster} alt={video.titulo} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/80 p-6 text-center">
              <Film className="h-8 w-8 text-cyan-300" />
              <p className="max-w-sm text-sm text-white/85">
                Este vídeo estará disponível em breve.
              </p>
            </div>
          </div>
        )}
        <p className="mt-3 text-center font-display text-base font-semibold text-white">
          {video.titulo}
        </p>
      </div>
    </div>
  )
}

// Grade de vídeos com player em tela cheia. Sem props, mostra os vídeos gerais;
// os álbuns (/galeria/:slug) passam os próprios vídeos e textos.
export default function Videos({
  itens = videos,
  id = 'videos',
  eyebrow = 'Vídeos',
  titulo = 'Memórias em movimento',
  texto = 'Histórias, reconhecimentos e momentos que mostram por que a APHAM é muito mais que handebol.',
  grade = 'sm:grid-cols-2 lg:grid-cols-4',
  className = '',
}) {
  const [current, setCurrent] = useState(null)

  return (
    <section id={id} className={`section-pad scroll-mt-24 py-24 lg:py-28 ${className}`}>
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {titulo}
          </h2>
          {texto && <p className="mt-4 text-ink/70">{texto}</p>}
        </Reveal>

        <div className={`mt-14 grid grid-cols-1 gap-6 ${grade}`}>
          {itens.map((v, i) => (
            <Reveal key={v.titulo} delay={0.05 * i}>
              <button
                type="button"
                onClick={() => setCurrent(v)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-navy-900 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.poster}
                    alt={v.titulo}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-navy-950/70 px-2 py-0.5 text-xs font-medium text-white">
                    <Clock className="h-3 w-3" />
                    {v.duracao}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-white">{v.titulo}</h3>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {current && <VideoModal video={current} onClose={() => setCurrent(null)} />}
    </section>
  )
}
