import { Trophy } from 'lucide-react'
import { clubes, equipes } from '../data/content'
import Reveal from './Reveal'

export default function Equipes() {
  return (
    <section id="equipes" className="relative overflow-hidden py-24 lg:py-28">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="section-pad container-x relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            Nossas equipes
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Os times do handebol do Marajó
          </h2>
          <p className="mt-4 text-white/70">
            Conheça as equipes que disputam os campeonatos da APHAM — escudo, história e conquistas
            de cada time.
          </p>
        </Reveal>

        {/* Clubes/times */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clubes.map((c, i) => (
            <Reveal key={c.nome} delay={0.06 * i}>
              <article className="flex h-full flex-col rounded-2xl bg-navy-900 p-6 text-center shadow-lift ring-1 ring-white/5">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <img
                    src={c.escudo}
                    alt={`Escudo ${c.nome}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{c.nome}</h3>
                {c.titulos && c.titulos.length > 0 && (
                  <ul className="mt-3 space-y-1 text-left">
                    {c.titulos.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-cyan-200">
                        <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {c.historia && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{c.historia}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Categorias (fotos reais) */}
        {equipes.length > 0 && (
          <>
            <Reveal delay={0.1}>
              <h3 className="mt-20 font-display text-2xl font-bold text-white">Nossas categorias</h3>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {equipes.map((e, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <article className="group relative overflow-hidden rounded-2xl bg-navy-900 shadow-lift">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={e.img}
                        alt={e.nome}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-base font-bold text-white">{e.nome}</h3>
                      <p className="mt-0.5 text-xs font-medium text-cyan-300">{e.papel}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-white/50">
            Em breve, as fichas completas dos times, atletas e categorias.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
