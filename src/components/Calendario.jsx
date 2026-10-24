import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, X } from 'lucide-react'
import { calendario } from '../data/content'
import { useStore } from '../store/StoreContext'
import { MESES, MESES_CURTOS, corDe, parseData, isoLocal, ocorrenciasPorDia } from '../lib/agenda'
import Reveal from './Reveal'

// Faixa "Próximos eventos" da home, de canto a canto: os próximos eventos em
// colunas + minicalendário com bolinhas nos dias que têm evento (clicar num dia
// mostra os eventos dele). A grade completa do mês fica em /competicoes#agenda.

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const QTD = 3

// Bloco de data grande: "19 / 21" com o mês embaixo de cada número.
function Datas({ e }) {
  const ini = parseData(e.data)
  const fim = parseData(e.fim)
  const parte = (p) => (
    <span className="flex flex-col">
      <span className="font-display text-5xl font-light leading-none text-white">{String(p.d).padStart(2, '0')}</span>
      <span className="mt-1.5 text-xs font-semibold tracking-[0.15em] text-white/70">{MESES_CURTOS[p.m]}.</span>
    </span>
  )
  const varios = fim && (fim.d !== ini.d || fim.m !== ini.m || fim.a !== ini.a)
  return (
    <div className="flex items-start gap-4">
      {parte(ini)}
      {varios && (
        <>
          <span className="mt-1 font-display text-4xl font-thin text-white/40">/</span>
          {parte(fim)}
        </>
      )}
    </div>
  )
}

function EventoCard({ e, encerrado, i }) {
  return (
    <Reveal delay={0.06 * i} className="h-full">
      <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.1]">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${corDe(e)}`}>
            {e.tipo || 'Evento'}
          </span>
          {encerrado && (
            <span className="rounded border border-white/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              Encerrado
            </span>
          )}
        </div>
        <div className="mt-6">
          <Datas e={e} />
        </div>
        <h3 className="mt-5 font-display text-base font-bold uppercase leading-snug tracking-wide text-white">{e.titulo}</h3>
        {e.local && (
          <p className="mt-auto flex items-center gap-1.5 pt-6 text-sm text-white/80">
            <MapPin className="h-4 w-4 shrink-0 text-cyan-300" />
            {e.local}
          </p>
        )}
      </article>
    </Reveal>
  )
}

export default function Calendario() {
  const { settings } = useStore()
  const eventos = settings?.calendarioEventos ?? calendario.eventos
  const hoje = new Date()
  const hojeIso = isoLocal(hoje)
  const [mes, setMes] = useState({ a: hoje.getFullYear(), m: hoje.getMonth() })
  const [diaSel, setDiaSel] = useState(null) // { a, m, d }

  const mapa = useMemo(() => ocorrenciasPorDia(eventos), [eventos])
  const ordenados = useMemo(() => [...(eventos || [])].sort((x, y) => (x.data > y.data ? 1 : -1)), [eventos])
  const acabou = (e) => (e.fim || e.data) < hojeIso

  // Próximos eventos; se faltarem, completa com os mais recentes já encerrados.
  const proximos = ordenados.filter((e) => !acabou(e))
  const recentes = ordenados.filter(acabou).reverse()
  const destaque = [...proximos, ...recentes].slice(0, QTD)
  const doDia = diaSel ? mapa[`${diaSel.a}-${diaSel.m}-${diaSel.d}`] || [] : null
  const mostrados = doDia ?? destaque

  // Grade do minicalendário (semana começando no domingo), com dias dos meses vizinhos.
  const primeiro = new Date(mes.a, mes.m, 1).getDay()
  const celulas = []
  for (let i = 0; i < 42; i++) {
    const dt = new Date(mes.a, mes.m, 1 - primeiro + i)
    celulas.push({ a: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate(), fora: dt.getMonth() !== mes.m })
  }
  // Tira a última semana se ela for toda do mês seguinte.
  if (celulas.slice(35).every((c) => c.fora)) celulas.length = 35

  const mudarMes = (dir) =>
    setMes((p) => {
      const dt = new Date(p.a, p.m + dir, 1)
      return { a: dt.getFullYear(), m: dt.getMonth() }
    })
  const ehHoje = (c) => c.a === hoje.getFullYear() && c.m === hoje.getMonth() && c.d === hoje.getDate()
  const ehSel = (c) => diaSel && c.a === diaSel.a && c.m === diaSel.m && c.d === diaSel.d

  return (
    <section id="calendario" className="relative overflow-hidden py-20 lg:py-24">
      {/* Fundo: foto do ginásio com camada azul da marca */}
      <img src="/midia/eventos/ginasio-melgaco.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 via-navy-800/90 to-cyan-700/80" />
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="section-pad relative mx-auto w-full max-w-[90rem]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            {calendario.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Próximos eventos</h2>
          <p className="mt-4 text-white/70">As competições e ações da APHAM. Toque num dia marcado do calendário para ver os eventos dele.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Eventos */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="mb-5 flex min-h-[2rem] flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {diaSel ? `Eventos em ${diaSel.d} de ${MESES[diaSel.m]}` : proximos.length ? 'Em breve' : 'Últimos eventos'}
              </p>
              {diaSel ? (
                <button
                  type="button"
                  onClick={() => setDiaSel(null)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <X className="h-3.5 w-3.5" />
                  Ver próximos eventos
                </button>
              ) : (
                <Link to="/competicoes#agenda" className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white hover:text-cyan-200">
                  Agenda completa
                  <ArrowRight className="h-4 w-4 text-cyan-300" />
                </Link>
              )}
            </div>

            {mostrados.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {mostrados.map((e, i) => (
                  <EventoCard key={`${e.data}-${e.titulo}`} e={e} encerrado={acabou(e)} i={i} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/25 p-10 text-center text-white/60">
                Nenhum evento marcado ainda. Volte em breve!
              </div>
            )}
          </div>

          {/* Minicalendário */}
          <Reveal delay={0.1} className="lg:col-span-4 xl:col-span-3">
            <div className="mx-auto w-full max-w-sm rounded-2xl bg-navy-950/80 p-5 shadow-lift ring-1 ring-white/10 backdrop-blur">
              <div className="flex items-center justify-between text-white">
                <button
                  type="button"
                  onClick={() => mudarMes(-1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="font-display text-base font-bold">
                  {MESES[mes.m]} {mes.a}
                </p>
                <button
                  type="button"
                  onClick={() => mudarMes(1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Próximo mês"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 text-center">
                {DIAS.map((d, i) => (
                  <span key={i} className="pb-2 text-[11px] font-semibold text-white/45">
                    {d}
                  </span>
                ))}
                {celulas.map((c) => {
                  const evs = mapa[`${c.a}-${c.m}-${c.d}`] || []
                  const tem = evs.length > 0
                  return (
                    <button
                      key={`${c.a}-${c.m}-${c.d}`}
                      type="button"
                      disabled={!tem}
                      onClick={() => setDiaSel(ehSel(c) ? null : c)}
                      title={tem ? evs.map((e) => e.titulo).join(' · ') : undefined}
                      aria-label={tem ? `${c.d} de ${MESES[c.m]}: ${evs.map((e) => e.titulo).join(', ')}` : `${c.d} de ${MESES[c.m]}`}
                      className="group flex h-11 flex-col items-center justify-center"
                    >
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                          ehHoje(c)
                            ? 'bg-white text-navy-900'
                            : ehSel(c)
                              ? 'bg-cyan-500 text-white'
                              : c.fora
                                ? 'text-white/25'
                                : tem
                                  ? 'text-white group-hover:bg-white/15'
                                  : 'text-white/80'
                        } ${ehSel(c) && ehHoje(c) ? 'ring-2 ring-cyan-400' : ''}`}
                      >
                        {c.d}
                      </span>
                      <span className="mt-0.5 flex h-1.5 gap-0.5">
                        {evs.slice(0, 3).map((e, j) => (
                          <span key={j} className={`h-1.5 w-1.5 rounded-full ${corDe(e).split(' ')[0]} ${c.fora ? 'opacity-40' : ''}`} />
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
