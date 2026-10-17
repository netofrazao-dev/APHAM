import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { hero, assinaturaSocialPlay } from '../data/content'
import HeroFeed from './HeroFeed'

// Camadas de fundo (sem pessoas) que vão alternando no topo do site.
const frames = [
  { type: 'img', src: '/midia/marca/marajoara-dark.jpg' },
  { type: 'gradient', className: 'bg-gradient-to-br from-navy-800 via-navy-950 to-cyan-900' },
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

      {/* Assinatura dourada da Social Play, de fundo */}
      <img
        src={assinaturaSocialPlay}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6%] top-1/2 w-[60%] max-w-2xl -translate-y-1/2 select-none opacity-[0.13] lg:opacity-[0.16]"
      />

      {/* Conteúdo */}
      <div className="container-x section-pad relative z-10 grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-24 pt-28 sm:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {/* Painel de novidades no mobile (ocupa o espaço entre o topo e o título) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 mt-2 lg:hidden"
          >
            <HeroFeed compact />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-white sm:text-xl lg:text-2xl"
          >
            Mais que uma Associação...
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
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
              href={hero.ctaQuemSomos.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              {hero.ctaQuemSomos.label}
            </a>
            <a
              href={hero.ctaApoie.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2faa3a] px-8 py-4 text-base font-bold text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#268a30]"
            >
              {hero.ctaApoie.label}
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        {/* Painel de novidades / resultados (lugar da antiga bola), só no desktop */}
        <div className="hidden lg:col-span-5 lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto w-full max-w-md"
          >
            <HeroFeed />
          </motion.div>
        </div>
      </div>

      {/* Indicadores dos fundos */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
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
        className="absolute bottom-6 right-6 z-10 hidden text-white/60 transition-colors hover:text-white sm:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
