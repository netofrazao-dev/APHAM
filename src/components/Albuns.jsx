import { Link } from 'react-router-dom'
import { ArrowUpRight, Images } from 'lucide-react'
import { albuns } from '../data/content'
import Reveal from './Reveal'

// Cards dos álbuns na página Galeria (cada um abre /galeria/<slug>).
export default function Albuns() {
  if (!albuns.length) return null
  return (
    <section id="albuns" className="section-pad pt-16 lg:pt-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Álbuns
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Ações em destaque</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albuns.map((a, i) => {
            const qtd = a.fotos.length + a.videos.length
            return (
              <Reveal key={a.slug} delay={0.06 * i}>
                <Link
                  to={`/galeria/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className={`aspect-[16/10] overflow-hidden ${a.capaContain ? 'flex items-center justify-center bg-white p-6' : ''}`}>
                    <img
                      src={a.capa}
                      alt={a.titulo}
                      loading="lazy"
                      className={`transition-transform duration-500 group-hover:scale-105 ${a.capaContain ? 'max-h-full w-auto object-contain' : 'h-full w-full object-cover'}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      <Images className="h-4 w-4" />
                      {qtd ? `${a.fotos.length} fotos · ${a.videos.length} vídeos` : 'Em breve'}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-bold text-navy-900">{a.titulo}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{a.descricao}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700">
                      Abrir álbum <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
