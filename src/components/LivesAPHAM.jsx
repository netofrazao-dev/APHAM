import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, PlayCircle, ArrowRight, Youtube } from 'lucide-react'
import { livesInfo } from '../data/content'
import { useStore } from '../store/StoreContext'
import { youtubeEmbed } from '../lib/youtube'
import Reveal from './Reveal'

// Um único card que mostra UM jogo e troca para outro (aleatório) toda vez que
// o card aparece na tela.
function CardRotativo({ jogos }) {
  const ref = useRef(null)
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, jogos.length)))

  useEffect(() => {
    const el = ref.current
    if (!el || jogos.length <= 1) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setI((prev) => {
              let n = Math.floor(Math.random() * jogos.length)
              if (n === prev) n = (n + 1) % jogos.length
              return n
            })
          }
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [jogos.length])

  if (!jogos.length) return null
  const j = jogos[i % jogos.length]

  return (
    <div ref={ref}>
    <Link
      to="/lives"
      className="group relative block overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-900 shadow-lift"
      aria-label={`Ver lives — ${j.titulo}`}
    >
      <div className="relative aspect-video">
        {jogos.map((g, idx) => (
          <img
            key={g.id}
            src={`https://i.ytimg.com/vi/${g.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: idx === i ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/10" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
            <PlayCircle className="h-8 w-8" />
          </span>
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
            Lives APHAM{j.torneio ? ` · ${j.torneio}` : ''}
          </p>
          <p className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug text-white">{j.titulo}</p>
        </div>
      </div>
    </Link>
    </div>
  )
}

// Seção "Lives APHAM" na home. Quando há transmissão ao vivo, ela vira destaque
// (embed). Os jogos passados aparecem num único card rotativo, com link para /lives.
export default function LivesAPHAM() {
  const { settings, lives } = useStore()
  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const embed = aoVivo ? youtubeEmbed(settings.aoVivoUrl) : null
  const jogos = (lives || []).slice(0, 8)

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

        {/* Card rotativo dos jogos + link para a página completa */}
        {jogos.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
              <CardRotativo jogos={jogos} />
              <div>
                <p className="text-white/80">
                  Já são <strong className="text-white">{lives.length} jogos</strong> transmitidos pela APHAM —
                  a Taça das Fronteiras Amazônicas e a Copa Handebol, direto do Marajó.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to="/lives" className="btn-accent">
                    <PlayCircle className="h-4 w-4" />
                    Ver todas as lives
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={livesInfo.canal} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white ring-1 ring-white/20 hover:bg-white/10">
                    <Youtube className="h-4 w-4" />
                    Canal no YouTube
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
