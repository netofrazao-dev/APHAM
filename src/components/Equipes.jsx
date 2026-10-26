import { Link } from 'react-router-dom'
import { ArrowUpRight, Trophy, PlayCircle } from 'lucide-react'
import { equipes } from '../data/content'
import { useStore } from '../store/StoreContext'
import { listarClubes, jogosDoTime } from '../lib/clubes'
import Reveal from './Reveal'
import Escudo from './Escudo'

export default function Equipes() {
  const { settings, lives } = useStore()
  const clubes = listarClubes(settings)
  return (
    <section id="equipes" className="relative overflow-hidden py-24 lg:py-28">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="section-pad container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            Nossas equipes
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Os times do handebol do Marajó
          </h2>
          <p className="mt-4 text-white/70">
            Conheça as equipes que disputam os campeonatos da APHAM — escudo, história e conquistas
            de cada time.
          </p>
        </Reveal>

        {/* Clubes/times — o escudo ocupa o card; cada card abre a página do time */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clubes.map((c, i) => {
            const jogos = jogosDoTime(lives, c.nome).length
            const cor = c.cores?.secundaria || '#22d3ee'
            return (
              <Reveal key={c.slug} delay={0.06 * i}>
                <Link
                  to={`/equipes/${c.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-navy-900 shadow-lift ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:ring-white/30"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Escudo
                      src={c.escudo}
                      alt={`Escudo ${c.nome}`}
                      fundo={c.fundoEscudo}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    {c.titulos?.length > 0 && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy-950/80 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur">
                        <Trophy className="h-3.5 w-3.5" />
                        {c.titulos.length}
                      </span>
                    )}
                  </div>
                  {/* Faixa com as cores do time */}
                  <div className="flex h-1.5">
                    <span className="flex-1" style={{ backgroundColor: c.cores?.primaria || '#0b2a52' }} />
                    <span className="flex-1" style={{ backgroundColor: cor }} />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 p-5">
                    <div className="text-left">
                      <h3 className="font-display text-xl font-extrabold text-white">{c.nome}</h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-white/60">
                        {jogos > 0 ? (
                          <>
                            <PlayCircle className="h-3.5 w-3.5" />
                            {jogos} {jogos === 1 ? 'jogo transmitido' : 'jogos transmitidos'}
                          </>
                        ) : (
                          'Ver o time'
                        )}
                      </p>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-cyan-500">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
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

      </div>
    </section>
  )
}
