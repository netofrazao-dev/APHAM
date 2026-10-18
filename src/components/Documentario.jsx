import { useState } from 'react'
import { Play, FileText, Clapperboard, Clock } from 'lucide-react'
import { documentario } from '../data/content'
import { youtubeId, youtubeEmbed } from '../lib/youtube'
import Reveal from './Reveal'

// Card de capítulo: mostra a capa e, ao clicar, toca o vídeo embutido no site.
function CapituloCard({ c, i }) {
  const [tocando, setTocando] = useState(false)
  const id = youtubeId(c.url)
  const temVideo = !!id
  const capa = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null

  return (
    <Reveal delay={0.06 * i}>
      <div
        className={`group overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-900 transition-all duration-300 ${
          temVideo ? 'hover:border-cyan-500/50' : 'opacity-70'
        }`}
      >
        <div className="relative aspect-video bg-gradient-to-br from-navy-800 to-navy-950">
          {tocando && temVideo ? (
            <iframe
              src={youtubeEmbed(c.url, { autoplay: true })}
              title={c.titulo}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : temVideo ? (
            <button
              type="button"
              onClick={() => setTocando(true)}
              aria-label={`Assistir ${c.titulo}`}
              className="absolute inset-0 h-full w-full"
            >
              <img src={capa} alt={c.titulo} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-navy-950/35 transition-colors duration-300 group-hover:bg-navy-950/15" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </span>
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Clapperboard className="h-10 w-10 text-cyan-300/40" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 p-4">
          <h3 className="font-display text-sm font-bold text-white">{c.titulo}</h3>
          {temVideo ? (
            tocando ? (
              <span className="text-xs font-medium text-cyan-300">no ar</span>
            ) : (
              <span className="text-xs font-medium text-cyan-300">assistir aqui</span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white/40">
              <Clock className="h-3 w-3" />
              em breve
            </span>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export default function Documentario() {
  return (
    <section id="documentario" className="relative overflow-hidden py-24 lg:py-28">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="section-pad container-x relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            Documentário
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A história da APHAM em capítulos
          </h2>
          <p className="mt-4 text-white/70">{documentario.descricao}</p>
          {documentario.folderPronto && (
            <a
              href={documentario.folder}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-6"
            >
              <FileText className="h-4 w-4" />
              Ver o folder do documentário
            </a>
          )}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {documentario.capitulos.map((c, i) => (
            <CapituloCard key={i} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
