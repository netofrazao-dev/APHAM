import { Link } from 'react-router-dom'
import { Radio, PlayCircle, ArrowRight, Youtube } from 'lucide-react'
import { livesInfo } from '../data/content'
import { useStore } from '../store/StoreContext'
import { youtubeEmbed } from '../lib/youtube'
import Reveal from './Reveal'

// Seção "Lives APHAM" na home. Quando há transmissão ao vivo, ela vira destaque
// (embed). Os jogos passados ficam na página /lives — aqui mostramos só uma
// prévia com o link para a página.
export default function LivesAPHAM() {
  const { settings, lives } = useStore()
  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const embed = aoVivo ? youtubeEmbed(settings.aoVivoUrl) : null
  const previa = (lives || []).slice(0, 4)

  return (
    <section id="lives" className="relative overflow-hidden py-24 lg:py-28">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="section-pad container-x relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            {livesInfo.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {livesInfo.titulo}
          </h2>
          <p className="mt-4 text-white/70">{livesInfo.intro}</p>
        </Reveal>

        {/* Destaque de transmissão ao vivo (quando o admin ativa) */}
        {aoVivo && (
          <Reveal delay={0.1}>
            <div className="mt-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-soft">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                Ao vivo agora
              </span>
              <p className="mt-3 font-display text-xl font-bold text-white">
                {settings.aoVivoTitulo || 'APHAM ao vivo'}
              </p>
              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 shadow-lift">
                {embed ? (
                  <div className="relative aspect-video">
                    <iframe
                      src={embed}
                      title={settings.aoVivoTitulo || 'APHAM ao vivo'}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a href={settings.aoVivoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 bg-white/5 px-6 py-12 text-center">
                    <Radio className="h-10 w-10 text-red-400" />
                    <span className="text-white/80">A transmissão está acontecendo agora no YouTube.</span>
                    <span className="btn-accent"><PlayCircle className="h-4 w-4" />Assistir no YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Prévia dos jogos transmitidos + link para a página completa */}
        {previa.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-12">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {previa.map((j) => (
                  <Link
                    key={j.id}
                    to="/lives"
                    className="group relative block overflow-hidden rounded-xl border border-navy-700/60 bg-navy-900"
                    aria-label={j.titulo}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={`https://i.ytimg.com/vi/${j.id}/hqdefault.jpg`}
                        alt={j.titulo}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-navy-950/40 transition-colors group-hover:bg-navy-950/20" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-9 w-9 text-white/90 drop-shadow" />
                      </span>
                    </div>
                    <p className="truncate px-3 py-2 text-xs font-medium text-white/80">{j.titulo}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/lives" className="btn-accent">
                  <PlayCircle className="h-4 w-4" />
                  Ver todas as lives ({lives.length})
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={livesInfo.canal} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white ring-1 ring-white/20 hover:bg-white/10">
                  <Youtube className="h-4 w-4" />
                  Canal no YouTube
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
