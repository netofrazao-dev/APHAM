import { motion } from 'framer-motion'
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react'
import { hero } from '../data/content'

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden">
      {/* Fundo branded (sem pessoas): grafismos marajoaras + degradês */}
      <div className="absolute inset-0 bg-navy-950" />
      <img
        src="/midia/marca/marajoara-dark.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="container-x section-pad relative grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-24 pt-28 lg:grid-cols-12">
        {/* Texto */}
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

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/85"
          >
            {hero.subtitulo}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href={hero.ctaPrimario.href} className="btn-accent text-base">
              {hero.ctaPrimario.label}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={hero.ctaSecundario.href}
              className="btn border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
            >
              {hero.ctaSecundario.label}
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
            {/* Anel de triângulos marajoaras girando devagar */}
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
            {/* Bola de handebol estilizada */}
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

      <a
        href="#sobre"
        aria-label="Rolar para baixo"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
