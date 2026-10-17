import { useEffect, useMemo, useState } from 'react'
import { Newspaper, ArrowUpRight, Trophy } from 'lucide-react'
import { novidades, resultados } from '../data/content'

// Monta uma lista intercalada de slides: placar de jogo + foto/novidade.
function buildSlides() {
  const placares = resultados.map((r) => ({ type: 'placar', data: r }))
  const fotos = novidades
    .filter((n) => n.img)
    .map((n) => ({ type: 'foto', data: n }))

  const slides = []
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
      <span className="max-w-[72px] truncate text-[11px] font-medium text-white/75">{time.nome}</span>
    </div>
  )
}

function PlacarSlide({ r }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 p-4">
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
        <div className="text-center">
          <div className="font-display text-3xl font-extrabold leading-none text-white">
            {r.casa.placar}
            <span className="mx-1.5 text-white/40">:</span>
            {r.fora.placar}
          </div>
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
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-cyan-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-soft">
        {n.tag}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[11px] font-medium text-cyan-200/90">{n.data}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white">{n.titulo}</p>
      </div>
    </div>
  )
}

export default function HeroFeed({ compact = false }) {
  const slides = useMemo(buildSlides, [])
  const [i, setI] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 4500)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-lift backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
          Novidades &amp; Resultados
        </span>
        <Newspaper className="h-4 w-4 text-cyan-200/80" />
      </div>

      {/* Palco dos slides */}
      <div className={`relative mt-3 overflow-hidden rounded-2xl ring-1 ring-white/10 ${compact ? 'h-44' : 'h-52'}`}>
        {slides.map((s, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: idx === i ? 1 : 0 }}
            aria-hidden={idx !== i}
          >
            {s.type === 'placar' ? <PlacarSlide r={s.data} /> : <FotoSlide n={s.data} />}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === i ? 'w-5 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <a
          href="#novidades"
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
        >
          Ver todas
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
