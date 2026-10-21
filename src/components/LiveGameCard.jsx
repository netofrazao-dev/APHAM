import { useState } from 'react'
import { Play } from 'lucide-react'
import { youtubeEmbed } from '../lib/youtube'

// Card de um jogo transmitido: mostra a thumbnail do YouTube e, ao clicar,
// toca o vídeo embutido no próprio site.
export default function LiveGameCard({ jogo }) {
  const [tocando, setTocando] = useState(false)
  const url = `https://www.youtube.com/watch?v=${jogo.id}`
  const capa = `https://i.ytimg.com/vi/${jogo.id}/hqdefault.jpg`

  return (
    <div className="group overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-900 transition-all duration-300 hover:border-cyan-500/50">
      <div className="relative aspect-video bg-gradient-to-br from-navy-800 to-navy-950">
        {tocando ? (
          <iframe
            src={youtubeEmbed(url, { autoplay: true })}
            title={jogo.titulo}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setTocando(true)}
            aria-label={`Assistir ${jogo.titulo}`}
            className="absolute inset-0 h-full w-full"
          >
            <img src={capa} alt={jogo.titulo} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-navy-950/35 transition-colors duration-300 group-hover:bg-navy-950/15" />
            {jogo.torneio && (
              <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                {jogo.torneio}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 p-4">
        <h3 className="font-display text-sm font-bold text-white">{jogo.titulo}</h3>
        <span className="shrink-0 text-xs font-medium text-cyan-300">{tocando ? 'no ar' : 'assistir aqui'}</span>
      </div>
    </div>
  )
}
