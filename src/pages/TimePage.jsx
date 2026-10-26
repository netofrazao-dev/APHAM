import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin, Play, PlayCircle, Quote, Shield, Swords, Trophy, Tv, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import PageShell from '../components/PageShell'
import Reveal from '../components/Reveal'
import Escudo from '../components/Escudo'
import { useStore } from '../store/StoreContext'
import { listarClubes, jogosDoTime } from '../lib/clubes'
import { youtubeEmbed } from '../lib/youtube'

// Página de um time (/equipes/:slug): hero nas cores do escudo, destaques,
// história e títulos (pelo painel), jogos transmitidos (das Lives) e outros times.

function JogoCard({ j, nome, cor, i }) {
  const [tocando, setTocando] = useState(false)
  const url = `https://youtu.be/${j.id}`
  return (
    <Reveal delay={0.05 * i}>
      <article className="overflow-hidden rounded-2xl bg-navy-900 shadow-lift ring-1 ring-white/10">
        <div className="relative aspect-video bg-navy-950">
          {tocando ? (
            <iframe
              src={youtubeEmbed(url, { autoplay: true })}
              title={j.titulo}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setTocando(true)} aria-label={`Assistir ${j.titulo}`} className="group absolute inset-0 h-full w-full">
              <img src={`https://i.ytimg.com/vi/${j.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lift transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: cor }}>
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </span>
              {j.fase && (
                <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-navy-950">{j.fase}</span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <p className="font-display text-base font-bold text-white">
            {nome} <span className="text-white/40">x</span> {j.adversario}
          </p>
          {j.torneio && <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70">{j.torneio}</span>}
        </div>
      </article>
    </Reveal>
  )
}

export default function TimePage() {
  const { slug } = useParams()
  const { settings, lives } = useStore()
  const clubes = listarClubes(settings)
  const time = clubes.find((c) => c.slug === slug)

  useEffect(() => {
    if (time) document.title = `${time.nome} · Equipes · APHAM`
  }, [time])

  if (!time) {
    return (
      <PageShell eyebrow="Equipes" titulo="Time não encontrado">
        <section className="section-pad py-16 text-center">
          <Link to="/equipes" className="btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Ver todos os times
          </Link>
        </section>
      </PageShell>
    )
  }

  const primaria = time.cores?.primaria || '#0b2a52'
  const destaque = time.cores?.secundaria || '#22d3ee'
  const jogos = jogosDoTime(lives, time.nome)
  const finalista = jogos.filter((j) => /^final$/i.test(j.fase))
  const torneios = [...new Set(jogos.map((j) => j.torneio).filter(Boolean))]
  const adversarios = [...new Set(jogos.map((j) => j.adversario))]
  const titulos = time.titulos || []
  const outros = clubes.filter((c) => c.slug !== slug)

  const numeros = [
    titulos.length > 0 && { valor: titulos.length, label: titulos.length === 1 ? 'título' : 'títulos', Icone: Trophy },
    jogos.length > 0 && { valor: jogos.length, label: jogos.length === 1 ? 'jogo transmitido' : 'jogos transmitidos', Icone: Tv },
    adversarios.length > 0 && { valor: adversarios.length, label: 'adversários enfrentados', Icone: Swords },
    torneios.length > 0 && { valor: torneios.join(' · '), label: torneios.length === 1 ? 'competição' : 'competições', Icone: Shield },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Hero nas cores do time */}
      <header className="relative overflow-hidden pb-24 pt-28 lg:pb-28 lg:pt-32" style={{ background: `linear-gradient(140deg, ${primaria} 0%, #0a1326 72%)` }}>
        <img src={time.escudo} alt="" aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/2 h-[42rem] w-[42rem] max-w-none -translate-y-1/2 rounded-full object-contain opacity-[0.07] blur-[2px]" />
        <div className="absolute inset-0 dot-grid opacity-15" />
        <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: `linear-gradient(90deg, ${primaria}, ${destaque})` }} />

        <div className="section-pad container-x relative text-center">
          <Reveal>
            <Link to="/equipes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Todas as equipes
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div
              className="mx-auto mt-8 h-48 w-48 overflow-hidden rounded-[2rem] shadow-lift ring-4 sm:h-56 sm:w-56"
              style={{ '--tw-ring-color': `${destaque}66`, boxShadow: `0 30px 80px -20px ${destaque}55` }}
            >
              <Escudo src={time.escudo} alt={`Escudo ${time.nome}`} fundo={time.fundoEscudo} className="h-full w-full" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow mt-8 flex justify-center text-white/80">
              <span className="h-px w-6" style={{ backgroundColor: destaque }} />
              Equipe · Handebol do Marajó
              <span className="h-px w-6" style={{ backgroundColor: destaque }} />
            </span>
            <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">{time.nome}</h1>
            {time.nomeCompleto && time.nomeCompleto !== time.nome && (
              <p className="mt-3 font-display text-lg font-semibold text-white/80">{time.nomeCompleto}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {time.cidade && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/15">
                  <MapPin className="h-4 w-4" style={{ color: destaque }} />
                  {time.cidade}
                </span>
              )}
              {finalista.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-extrabold text-navy-950">
                  <Trophy className="h-4 w-4" />
                  Finalista da {finalista[0].torneio || 'competição'}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/15">
                <Users className="h-4 w-4" style={{ color: destaque }} />
                Campeonatos da APHAM
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      <main>
        {/* Números (sobrepostos ao hero) */}
        {numeros.length > 0 && (
          <section className="section-pad relative -mt-14">
            <div className={`container-x grid grid-cols-2 gap-4 ${numeros.length >= 4 ? 'lg:grid-cols-4' : numeros.length === 3 ? 'lg:grid-cols-3' : ''}`}>
              {numeros.map((n, i) => (
                <Reveal key={n.label} delay={0.05 * i} className={numeros.length % 2 && i === numeros.length - 1 ? 'col-span-2 lg:col-span-1' : ''}>
                  <div className="h-full rounded-2xl bg-white p-5 text-center shadow-lift ring-1 ring-navy-100">
                    <n.Icone className="mx-auto h-6 w-6" style={{ color: primaria === '#141414' || primaria === '#101010' ? '#0b2a52' : primaria }} />
                    <p className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{n.valor}</p>
                    <p className="mt-1 text-sm text-ink/60">{n.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Lema + história */}
        {(time.lema || time.historia) && (
          <section className="section-pad py-16 lg:py-20">
            <div className="container-x max-w-3xl text-center">
              {time.lema && (
                <Reveal>
                  <Quote className="mx-auto h-8 w-8" style={{ color: destaque }} />
                  <p className="mt-4 font-display text-xl font-bold leading-relaxed text-navy-900 sm:text-2xl">“{time.lema}”</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">Lema do escudo</p>
                </Reveal>
              )}
              {time.historia && (
                <Reveal delay={0.05}>
                  <span className="eyebrow mt-12 flex justify-center">
                    <span className="h-px w-6 bg-cyan-400" />
                    História
                    <span className="h-px w-6 bg-cyan-400" />
                  </span>
                  <p className="mt-5 whitespace-pre-line text-left text-base leading-relaxed text-ink/80 sm:text-lg">{time.historia}</p>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Sem lema nem história ainda: apresenta o time com o que se sabe */}
        {!time.lema && !time.historia && (
          <section className="section-pad py-16 lg:py-20">
            <Reveal className="container-x max-w-4xl">
              <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy-100 sm:p-10 md:grid-cols-[200px_1fr]">
                <Escudo src={time.escudo} fundo={time.fundoEscudo} className="mx-auto aspect-square w-40 rounded-2xl md:w-full" />
                <div className="text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Sobre o time</p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{time.nomeCompleto || time.nome}</h2>
                  <p className="mt-3 leading-relaxed text-ink/75">
                    O {time.nome} é uma das equipes que disputam os campeonatos de handebol organizados pela APHAM no Marajó.
                    {jogos.length === 0 && ' Acompanhe as próximas partidas pelas lives da associação.'}
                  </p>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Conquistas */}
        {titulos.length > 0 && (
          <section className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
            <div className="container-x">
              <Reveal className="mx-auto max-w-2xl text-center">
                <span className="eyebrow flex justify-center">
                  <span className="h-px w-6 bg-cyan-400" />
                  Conquistas
                  <span className="h-px w-6 bg-cyan-400" />
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold text-navy-900">Galeria de títulos</h2>
              </Reveal>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {titulos.map((t, i) => (
                  <Reveal key={t} delay={0.05 * i}>
                    <div className="flex h-full items-center gap-4 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 p-5 shadow-lift">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950/15 text-navy-950">
                        <Trophy className="h-6 w-6" />
                      </span>
                      <p className="font-display text-base font-extrabold text-navy-950">{t}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Na quadra: jogos transmitidos */}
        {jogos.length > 0 && (
          <section className="section-pad relative overflow-hidden bg-navy-950 py-16 lg:py-20">
            <div className="absolute inset-0 dot-grid opacity-15" />
            <div className="container-x relative">
              <Reveal className="mx-auto max-w-2xl text-center">
                <span className="eyebrow flex justify-center text-white/80">
                  <span className="h-px w-6" style={{ backgroundColor: destaque }} />
                  Na quadra
                  <span className="h-px w-6" style={{ backgroundColor: destaque }} />
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">Jogos do {time.nome}</h2>
                <p className="mt-3 text-white/65">Partidas transmitidas ao vivo pela APHAM — assista aqui mesmo.</p>
              </Reveal>
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jogos.map((j, i) => (
                  <JogoCard key={j.id} j={j} nome={time.nome} cor={destaque === '#d6d6d6' ? '#06b6d4' : destaque} i={i} />
                ))}
              </div>
              {adversarios.length > 0 && (
                <Reveal>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <span className="mr-1 text-sm font-semibold text-white/60">Adversários:</span>
                    {adversarios.map((a) => (
                      <span key={a} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/10">{a}</span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Foto do time */}
        {time.foto && (
          <section className="section-pad py-16 lg:py-20">
            <Reveal className="container-x max-w-4xl">
              <figure className="overflow-hidden rounded-3xl shadow-lift">
                <img src={time.foto} alt={`Time ${time.nome}`} loading="lazy" className="w-full object-cover" />
              </figure>
            </Reveal>
          </section>
        )}

        {/* Chamada */}
        <section className="section-pad py-16 lg:py-20">
          <Reveal className="container-x">
            <div className="relative overflow-hidden rounded-[2rem] p-8 text-center shadow-lift sm:p-12" style={{ background: `linear-gradient(120deg, ${primaria}, #0a1326)` }}>
              <div className="absolute inset-0 dot-grid opacity-15" />
              <div className="relative">
                <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">Quer jogar handebol no Marajó?</h2>
                <p className="mx-auto mt-3 max-w-xl text-white/75">Conheça as turmas e os projetos da APHAM — e acompanhe os jogos dos times pelas nossas lives.</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link to="/participar" className="btn bg-white text-navy-900 hover:bg-white/90">
                    Como participar
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link to="/lives" className="btn border border-white/40 text-white hover:bg-white/10">
                    <PlayCircle className="h-4 w-4" />
                    Ver as lives
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Outros times */}
        {outros.length > 0 && (
          <section className="section-pad border-t border-navy-100 py-16 lg:py-20">
            <div className="container-x">
              <Reveal className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-2xl font-extrabold text-navy-900">Outras equipes</h2>
              </Reveal>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {outros.map((c, i) => (
                  <Reveal key={c.slug} delay={0.05 * i} className="w-[calc(50%-0.5rem)] sm:w-52">
                    <Link to={`/equipes/${c.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                      <Escudo src={c.escudo} alt={`Escudo ${c.nome}`} fundo={c.fundoEscudo} className="aspect-square" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                      <div className="flex h-1">
                        <span className="flex-1" style={{ backgroundColor: c.cores?.primaria || '#0b2a52' }} />
                        <span className="flex-1" style={{ backgroundColor: c.cores?.secundaria || '#22d3ee' }} />
                      </div>
                      <p className="p-3 text-center font-display text-base font-bold text-navy-900">{c.nome}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  )
}
