import { Radio, ExternalLink } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { youtubeEmbed } from '../lib/youtube'
import Reveal from './Reveal'

// Seção de transmissão ao vivo. Só aparece quando o admin ativa e cola o link.
export default function AoVivo() {
  const { settings } = useStore()
  if (!settings?.aoVivoAtivo || !settings?.aoVivoUrl) return null

  const embed = youtubeEmbed(settings.aoVivoUrl)
  const titulo = settings.aoVivoTitulo || 'APHAM ao vivo'

  return (
    <section id="ao-vivo" className="relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />

      <div className="section-pad container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-soft">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Ao vivo agora
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {titulo}
          </h2>
          <p className="mt-3 text-white/70">
            Acompanhe a transmissão da APHAM em tempo real. Ative o som e torça com a gente!
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-4xl">
            {embed ? (
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-lift">
                <div className="relative aspect-video">
                  <iframe
                    src={embed}
                    title={titulo}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              // Se o link não for reconhecido, oferece abrir no YouTube.
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                <Radio className="h-10 w-10 text-red-400" />
                <p className="text-white/80">A transmissão está acontecendo agora no YouTube.</p>
                <a
                  href={settings.aoVivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                  Assistir no YouTube
                </a>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
