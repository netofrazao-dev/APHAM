import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartHandshake, ChevronDown, Youtube, Facebook, Instagram } from 'lucide-react'
import { hero, assinaturaSocialPlay, site, redesHeader } from '../data/content'
import HeroFeed from './HeroFeed'

const SOCIAL_ICONS = { Youtube, Facebook, Instagram }
const redes = redesHeader.map((r) => ({ ...r, href: site[r.url] }))

// Camadas de fundo (sem pessoas) que vão alternando no topo do site.
const frames = [
  { type: 'img', src: '/midia/marca/marajoara-dark.jpg' },
  { type: 'gradient', className: 'bg-gradient-to-br from-navy-800 via-navy-950 to-cyan-900' },
  { type: 'sign', src: assinaturaSocialPlay },
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
            ) : f.type === 'sign' ? (
              // Assinatura dourada da Social Play como um dos fundos que alternam.
              <div className="h-full w-full bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900">
                <div className="absolute inset-0 dot-grid opacity-20" />
                <img
                  src={f.src}
                  alt=""
                  className={`absolute left-1/2 top-1/2 w-[82%] max-w-3xl -translate-x-1/2 -translate-y-1/2 object-contain opacity-70 ${
                    i === active ? 'animate-float' : ''
                  }`}
                />
              </div>
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
      <div className="container-x section-pad relative z-10 grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-24 pt-28 sm:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          {/* Redes sociais no topo do hero (só no celular) */}
          <div className="mb-4 flex justify-end gap-2.5 lg:hidden">
            {redes.map((r) => {
              const Ic = SOCIAL_ICONS[r.icone]
              return (
                <a
                  key={r.nome}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.nome}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
                >
                  <Ic className="h-4 w-4" />
                </a>
              )
            })}
          </div>

          {/* Painel de novidades no mobile (ocupa o espaço entre o topo e o título) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="-mx-5 mb-8 mt-2 sm:-mx-8 lg:hidden"
          >
            <HeroFeed compact />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.14, 1] }}
            transition={{
              opacity: { duration: 0.6 },
              y: { duration: 0.6 },
              scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: 'left center' }}
            className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-white sm:text-xl lg:text-2xl"
          >
            Mais que uma Associação...
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, scale: [1, 0.9, 1] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.1 },
              y: { duration: 0.7, delay: 0.1 },
              scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: 'left center' }}
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
            <Link
              to={hero.ctaQuemSomos.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-white bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              {hero.ctaQuemSomos.label}
            </Link>
            <a
              href={hero.ctaApoie.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-[#7cb342] px-8 py-4 text-base font-bold text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6ba233]"
            >
              {hero.ctaApoie.label}
              <HeartHandshake className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        {/* Painel de novidades / resultados (lugar da antiga bola), só no desktop */}
        <div className="hidden lg:col-span-6 lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto w-full max-w-xl"
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
