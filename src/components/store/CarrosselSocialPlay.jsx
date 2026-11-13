import { useEffect, useRef, useState } from 'react'
import { carrosselLoja } from '../../data/content'

const TROCA_MS = 4000
// Rotação leve de cada imagem, para parecerem soltas (sem fundo) no espaço.
const GIROS = [-4, 3, -2, 4, -3]

// Carrossel da Loja SocialPlay: slides com frases e imagens sem fundo
// (src/data/content.js → carrosselLoja). Troca sozinho, para com o mouse em
// cima, aceita deslizar com o dedo e tem bolinhas para escolher o slide.
// Feito para fundo escuro (azul-marinho).
export default function CarrosselSocialPlay({ slides = carrosselLoja, className = 'h-72' }) {
  const [i, setI] = useState(0)
  const [pausado, setPausado] = useState(false)
  const toque = useRef(null)
  const total = slides.length
  const ir = (n) => setI((n + total) % total)

  useEffect(() => {
    if (pausado || total < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % total), TROCA_MS)
    return () => clearInterval(t)
  }, [pausado, total])

  const fimToque = (e) => {
    const dx = e.changedTouches[0].clientX - (toque.current ?? 0)
    if (Math.abs(dx) > 40) ir(dx < 0 ? i + 1 : i - 1)
  }

  return (
    <div
      className={`relative select-none ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Destaques da Loja SocialPlay"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
      onTouchEnd={fimToque}
    >
      {slides.map((s, n) => {
        const ativo = n === i
        const comFrase = Boolean(s.frase)
        return (
          <div
            key={n}
            aria-hidden={!ativo}
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 px-2 pb-8 text-center transition-all duration-700 ${
              ativo ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-6 opacity-0'
            }`}
          >
            {comFrase && (
              <div>
                <p className="font-akbar text-3xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl">{s.frase}</p>
                {s.sub && <p className="mt-1 text-sm font-medium text-cyan-200">{s.sub}</p>}
              </div>
            )}
            {/* As fotos dividem a largura (sem quebrar linha) e mantêm o formato:
                bonés largos, chaveiros compridos etc. */}
            <div className="flex w-full max-w-lg items-end justify-center gap-2 sm:gap-4">
              {s.imgs.map((src, k) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className={`min-w-0 flex-1 object-contain motion-safe:animate-float drop-shadow-[0_14px_16px_rgba(0,0,0,0.45)] ${
                    comFrase ? 'h-24 max-w-[9rem] sm:h-28' : 'h-36 max-w-[10rem] sm:h-44'
                  }`}
                  style={{ rotate: `${GIROS[k % GIROS.length]}deg`, animationDelay: `${k * -1.3}s` }}
                />
              ))}
            </div>
            {!comFrase && s.legenda && (
              <span className="rounded-full border border-cyan-400/40 bg-navy-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {s.legenda}
              </span>
            )}
            <span className="sr-only">{s.frase || s.legenda}</span>
          </div>
        )
      })}

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5">
          {slides.map((s, n) => (
            <button
              key={n}
              type="button"
              onClick={() => ir(n)}
              aria-label={`Ver o destaque ${n + 1}: ${s.frase || s.legenda}`}
              aria-current={n === i}
              className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-cyan-400' : 'w-2 bg-white/35 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
