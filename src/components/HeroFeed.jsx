import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, PlayCircle } from 'lucide-react'
import { useStore } from '../store/StoreContext'

// Monta a lista de slides do card do topo: (ao vivo) + fotos das novidades +
// UM único slide de "jogos" (que troca o jogo que mostra toda vez que aparece).
function buildSlides(aoVivo, novidades = [], temJogos = false) {
  const slides = []
  if (aoVivo) slides.push({ type: 'live', data: aoVivo })

  const fotos = (novidades || [])
    .filter((n) => n.img)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((n) => ({ type: 'foto', data: n }))
  for (const f of fotos) slides.push(f)

  if (temJogos) slides.push({ type: 'jogos' })
  return slides
}

// Clicar na foto abre a subpágina dessa novidade.
function FotoSlide({ n }) {
  return (
    <Link to={`/novidades/${encodeURIComponent(n.id)}`} className="relative block h-full overflow-hidden" aria-label={n.titulo}>
      <img src={n.img} alt="" className="h-full w-full object-cover" loading="lazy" />
      {/* Só um degradê no rodapé para a leitura do texto (sem esmaecer a foto à esquerda) */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
          {n.tag}
          {n.data ? ` · ${n.data}` : ''}
        </p>
        <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white">{n.titulo}</p>
      </div>
    </Link>
  )
}

// Slide ÚNICO dos jogos (Lives APHAM): mostra UM jogo e troca para outro jogo
// (aleatório) toda vez que este slide aparece (vira o slide ativo do card).
function JogosSlide({ jogos, ativo }) {
  const lista = (jogos || []).slice(0, 12)
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, lista.length)))
  const antes = useRef(ativo)

  useEffect(() => {
    if (ativo && !antes.current && lista.length > 1) {
      setI((prev) => {
        let n = Math.floor(Math.random() * lista.length)
        if (n === prev) n = (n + 1) % lista.length
        return n
      })
    }
    antes.current = ativo
  }, [ativo, lista.length])

  if (!lista.length) return null
  const j = lista[i % lista.length]

  return (
    <Link to="/lives" className="group relative block h-full overflow-hidden" aria-label={j.titulo}>
      {lista.map((g, idx) => (
        <img
          key={g.id}
          src={`https://i.ytimg.com/vi/${g.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: idx === i ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/10" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
          <PlayCircle className="h-7 w-7" />
        </span>
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Lives APHAM{j.torneio ? ` · ${j.torneio}` : ''}
        </p>
        <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white">{j.titulo}</p>
      </div>
    </Link>
  )
}

function LiveSlide({ titulo }) {
  return (
    <a
      href="#lives"
      className="group relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-navy-950 p-6 pt-12 text-center"
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
  const { settings, novidades, lives } = useStore()
  const aoVivo =
    settings?.aoVivoAtivo && settings?.aoVivoUrl
      ? { titulo: settings.aoVivoTitulo || 'APHAM ao vivo' }
      : null

  const slides = useMemo(
    () => buildSlides(aoVivo, novidades, (lives || []).length > 0),
    [aoVivo, novidades, lives]
  )
  const [i, setI] = useState(0)
  // Pausa a rotação enquanto o dedo está em cima (ou o mouse sobre o card).
  const [paused, setPaused] = useState(false)

  // Mantém o índice válido se a lista mudar (ex.: ligar/desligar o ao vivo).
  useEffect(() => {
    setI((p) => (p >= slides.length ? 0 : p))
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 4500)
    return () => clearInterval(id)
  }, [slides.length, paused])

  // Arrastar o dedo (swipe) para trocar de slide no celular.
  const touchX = useRef(null)
  const onTouchStart = (e) => {
    touchX.current = e.changedTouches[0].clientX
    setPaused(true) // segurou o dedo em cima: para de rodar
  }
  const onTouchEnd = (e) => {
    setPaused(false) // soltou o dedo: volta a rodar
    if (touchX.current == null || slides.length <= 1) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      setI((p) => (((dx < 0 ? p + 1 : p - 1) % slides.length) + slides.length) % slides.length)
    }
    touchX.current = null
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative touch-pan-y select-none overflow-hidden shadow-lift ${compact ? 'h-56 rounded-none sm:h-60' : 'h-[26rem] rounded-xl ring-1 ring-white/10'}`}
    >
      {slides.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? 'auto' : 'none' }}
          aria-hidden={idx !== i}
        >
          {s.type === 'live' ? (
            <LiveSlide titulo={s.data.titulo} />
          ) : s.type === 'jogos' ? (
            <JogosSlide jogos={lives} ativo={idx === i} />
          ) : (
            <FotoSlide n={s.data} />
          )}
        </div>
      ))}

      {/* Rótulo fixo do card + leve escurecimento no topo para leitura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/45 to-transparent" />
      <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-b-2xl bg-pink-500 px-10 py-2.5 text-sm font-extrabold uppercase tracking-[0.22em] text-white shadow-lift sm:px-14 sm:text-base">
        Novidades
      </span>

      {/* Indicadores sobre a imagem, dentro de uma caixinha retangular */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-lg bg-navy-950/45 px-2.5 py-1.5 ring-1 ring-white/25 backdrop-blur-sm">
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
