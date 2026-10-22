import { Youtube, Radio, PlayCircle } from 'lucide-react'
import PageShell from '../components/PageShell'
import LiveGameCard from '../components/LiveGameCard'
import { livesInfo } from '../data/content'
import { useStore } from '../store/StoreContext'
import { youtubeEmbed } from '../lib/youtube'

export default function LivesPage() {
  const { lives, settings } = useStore()
  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const embed = aoVivo ? youtubeEmbed(settings.aoVivoUrl) : null
  // Agrupa os jogos por torneio, preservando a ordem.
  const torneios = []
  for (const j of lives) {
    let g = torneios.find((t) => t.nome === j.torneio)
    if (!g) {
      g = { nome: j.torneio, jogos: [] }
      torneios.push(g)
    }
    g.jogos.push(j)
  }

  return (
    <PageShell eyebrow={livesInfo.eyebrow} titulo={livesInfo.titulo} descricao={livesInfo.intro}>
      <section className="relative overflow-hidden bg-navy-950 py-16 lg:py-20">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="section-pad container-x relative">
          {/* Destaque de transmissão ao vivo (quando o admin ativa) */}
          {aoVivo && (
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-soft">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                Ao vivo agora
              </span>
              <p className="mt-3 font-display text-xl font-bold text-white">{settings.aoVivoTitulo || 'APHAM ao vivo'}</p>
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
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              {lives.length} jogos transmitidos pela APHAM. Clique para assistir aqui mesmo.
            </p>
            <a href={livesInfo.canal} target="_blank" rel="noopener noreferrer" className="btn-accent">
              <Youtube className="h-4 w-4" />
              Ver no YouTube
            </a>
          </div>

          {torneios.map((t) => (
            <div key={t.nome} className="mt-12 first:mt-10">
              <h2 className="font-display text-xl font-bold text-white">
                {t.nome} <span className="text-white/40">· {t.jogos.length}</span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {t.jogos.map((j) => (
                  <LiveGameCard key={j.id} jogo={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
