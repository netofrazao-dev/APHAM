import { useEffect, useMemo, useState } from 'react'
import { Trophy, Radio, PlayCircle } from 'lucide-react'
import { novidades, resultados } from '../data/content'
import { useStore } from '../store/StoreContext'

// Monta a lista de slides: (ao vivo) + placar + foto, intercalando placar/foto.
function buildSlides(aoVivo) {
  const slides = []
  if (aoVivo) slides.push({ type: 'live', data: aoVivo })

  const placares = resultados.map((r) => ({ type: 'placar', data: r }))
  const fotos = novidades.filter((n) => n.img).map((n) => ({ type: 'foto', data: n }))
  const max = Math.max(placares.length, fotos.length)
  for (let i = 0; i < max; i++) {
    if (placares[i]) slides.push(placares[i])
    if (fotos[i]) slides.push(fotos[i])
  }
  return slides
}

function Badge({ time }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {time.logo ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-soft">
          <img src={time.logo} alt={time.nome} className="h-full w-full object-contain" />
        </span>
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white ring-1 ring-white/20">
          {time.sigla}
        </span>
      )}
      <span className="max-w-[80px] truncate text-xs font-medium text-white/75">{time.nome}</span>
    </div>
  )
}

function PlacarSlide({ r }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 p-5">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-200/90">
          <Trophy className="h-3.5 w-3.5" />
          <span className="max-w-[150px] truncate">{r.competicao}</span>
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
          {r.data}
        </span>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Badge time={r.casa} />
        <div className="font-display text-4xl font-extrabold leading-none text-white">
          {r.casa.placar}
          <span className="mx-1.5 text-white/40">:</span>
          {r.fora.placar}
        </div>
        <Badge time={r.fora} />
      </div>

      <div className="relative flex justify-center">
        <span className="rounded-full bg-[#2faa3a] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-soft">
          {r.status}
        </span>
      </div>
    </div>
  )
}

function FotoSlide({ n }) {
  return (
    <div className="relative h-full overflow-hidden">
      <img src={n.img} alt="" className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-navy-950/10" />
      <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold text-white shadow-soft">
        {n.tag}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
        <p className="text-xs font-semibold text-cyan-200">{n.data}</p>
        <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white">{n.titulo}</p>
      </div>
    </div>
  )
}

function LiveSlide({ titulo }) {
  return (
    <a
      href="#ao-vivo"
      className="group relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-navy-950 p-6 text-center"
    >
      <div className="absolute inset-0 dot-grid opacity-20" />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/25">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        Ao vivo agora
      </span>
      <Radio className="relative h-9 w-9 text-white/90" />
      <h3 className="relative max-w-[16rem] font-display text-lg font-extrabold leading-tight text-white">
        {titulo}
      </h3>
      <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-white">
        <PlayCircle className="h-4 w-4" />
        Assistir agora
      </span>
    </a>
  )
}

export default function HeroFeed({ compact = false }) {
  const { settings } = useStore()
  const aoVivo =
    settings?.aoVivoAtivo && settings?.aoVivoUrl
      ? { titulo: settings.aoVivoTitulo || 'APHAM ao vivo' }
      : null

  const slides = useMemo(() => buildSlides(aoVivo), [aoVivo])
  const [i, setI] = useState(0)

  // Garante que o índice continua válido se a lista mudar (ex.: ligar o ao vivo).
  useEffect(() => {
    setI((p) => (p >= slides.length ? 0 : p))
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 4500)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <div className={`relative overflow-hidden shadow-lift ${compact ? 'h-56 rounded-none sm:h-60' : 'h-72 rounded-3xl ring-1 ring-white/10'}`}>
      {slides.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? 'auto' : 'none' }}
          aria-hidden={idx !== i}
        >
          {s.type === 'live' ? (
            <LiveSlide titulo={s.data.titulo} />
          ) : s.type === 'placar' ? (
            <PlacarSlide r={s.data} />
          ) : (
            <FotoSlide n={s.data} />
          )}
        </div>
      ))}

      {/* Indicadores sobre a imagem (sem moldura) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full shadow transition-all duration-300 ${
                idx === i ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
