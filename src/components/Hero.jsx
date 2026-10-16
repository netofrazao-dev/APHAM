import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react'
import { hero } from '../data/content'

// Camadas de fundo (sem pessoas) que vão alternando no topo do site.
const frames = [
  { type: 'img', src: '/midia/marca/marajoara-dark.jpg' },
  { type: 'gradient', className: 'bg-gradient-to-br from-navy-800 via-navy-950 to-cyan-900' },
  { type: 'img', src: '/midia/marca/assinatura-branca-dark.jpg' },
]

export default function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % frames.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden">
      {/* Fundo que alterna (branded, sem pessoas) */}
      <div className="absolute inset-0 bg-navy-950">
        {frames.map((f, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden="true"
          >
            {f.type === 'img' ? (
              <img
                src={f.src}
                alt=""
                className={`h-full w-full object-cover opacity-75 ${i === active ? 'animate-kenburns' : ''}`}
              />
            ) : (
              <div className={`h-full w-full ${f.className}`}>
                <div className="absolute inset-0 dot-grid opacity-40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Degradês — escurecem o lado do texto e deixam o fundo mais visível à direita */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-900/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/35" />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Conteúdo */}
      <div className="container-x section-pad relative grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-24 pt-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-navy-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            {hero.tagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Muito mais que{' '}
            <span className="relative whitespace-nowrap text-cyan-400">
              handebol
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2 8 C 50 2, 150 2, 198 8" stroke="#33b6f5" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href={hero.ctaApoie.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2faa3a] px-8 py-4 text-base font-bold text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#268a30] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2faa3a] focus-visible:ring-offset-2"
            >
              {hero.ctaApoie.label}
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={hero.ctaQuemSomos.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {hero.ctaQuemSomos.label}
            </a>
          </motion.div>
        </div>

        {/* Motivo branded (sem pessoas): grafismo marajoara + bola de handebol */}
        <div className="hidden lg:col-span-5 lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-10 rounded-full bg-cyan-500/20 blur-3xl" />
            <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow text-cyan-300/70">
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d="M100 10 L108 26 L92 26 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  transform={`rotate(${i * 30} 100 100)`}
                />
              ))}
            </svg>
            <svg viewBox="0 0 200 200" className="absolute inset-0 animate-float">
              <circle cx="100" cy="100" r="58" fill="#0a1326" stroke="#33b6f5" strokeWidth="2.5" />
              <g stroke="#33b6f5" strokeWidth="2" strokeLinecap="round" opacity="0.85">
                <path d="M100 44 L100 156" />
                <path d="M50 72 L150 128" />
                <path d="M150 72 L50 128" />
              </g>
              <circle cx="100" cy="100" r="9" fill="#33b6f5" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Indicadores dos fundos */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
        {frames.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Fundo ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-8 bg-cyan-400' : 'w-4 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <a
        href="#sobre"
        aria-label="Rolar para baixo"
        className="absolute bottom-6 right-6 hidden text-white/60 transition-colors hover:text-white sm:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
