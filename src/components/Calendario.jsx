import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Info } from 'lucide-react'
import { calendario } from '../data/content'
import { useStore } from '../store/StoreContext'
import Reveal from './Reveal'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const ANO = calendario.ano || 2026

// Cores das competições (barrinhas no dia), no estilo do calendário da EHF.
const CORES = {
  cyan: 'bg-cyan-500 text-white',
  amber: 'bg-amber-500 text-navy-950',
  red: 'bg-red-600 text-white',
  green: 'bg-[#2faa3a] text-white',
  blue: 'bg-blue-600 text-white',
  purple: 'bg-purple-600 text-white',
}

function parseData(s) {
  const [a, m, d] = (s || '').split('-').map(Number)
  return a && m && d ? { a, m: m - 1, d } : null
}

// Expande cada evento (inclui intervalos com `fim`) para ocorrências por dia,
// agrupadas por "mes-dia" dentro do ano do calendário.
function ocorrenciasPorDia(eventos) {
  const map = {}
  for (const e of eventos || []) {
    const ini = parseData(e.data)
    if (!ini) continue
    const fim = parseData(e.fim) || ini
    const start = new Date(ini.a, ini.m, ini.d)
    const end = new Date(fim.a, fim.m, fim.d)
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      if (dt.getFullYear() !== ANO) continue
      const k = `${dt.getMonth()}-${dt.getDate()}`
      ;(map[k] = map[k] || []).push(e)
    }
  }
  return map
}

export default function Calendario() {
  const { settings } = useStore()
  const eventos = settings?.calendarioEventos ?? calendario.eventos
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getFullYear() === ANO ? hoje.getMonth() : 0)
  const mapa = ocorrenciasPorDia(eventos)

  // getDay(): 0=Dom..6=Sáb. Queremos semana começando na segunda.
  const primeiro = (new Date(ANO, mes, 1).getDay() + 6) % 7
  const diasNoMes = new Date(ANO, mes + 1, 0).getDate()
  const celulas = []
  for (let i = 0; i < primeiro; i++) celulas.push(null)
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d)

  const ehHoje = (d) => hoje.getFullYear() === ANO && hoje.getMonth() === mes && hoje.getDate() === d

  // Eventos do mês (únicos) para a lista detalhada.
  const eventosDoMes = (eventos || [])
    .filter((e) => {
      const ini = parseData(e.data)
      const fim = parseData(e.fim) || ini
      return ini && (ini.m === mes || (fim && fim.m === mes))
    })
    .sort((a, b) => (a.data > b.data ? 1 : -1))

  const fmtIntervalo = (e) => {
    const ini = parseData(e.data)
    const fim = parseData(e.fim)
    if (fim && (fim.d !== ini.d || fim.m !== ini.m)) {
      return `${ini.d} a ${fim.d} de ${MESES[fim.m]}`
    }
    return `${ini.d} de ${MESES[ini.m]}`
  }

  return (
    <section id="calendario" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {calendario.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {calendario.titulo}
          </h2>
          <p className="mt-4 text-ink/70">{calendario.intro}</p>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl bg-navy-950 shadow-lift ring-1 ring-white/10">
            {/* Cabeçalho do mês com navegação */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
              <button
                type="button"
                onClick={() => setMes((m) => Math.max(0, m - 1))}
                disabled={mes === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="font-display text-lg font-extrabold">{MESES[mes]} <span className="text-white/50">{ANO}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setMes((m) => Math.min(11, m + 1))}
                disabled={mes === 11}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Grade de dias (estilo EHF: barrinhas com o nome da competição) */}
            <div className="grid grid-cols-7 border-l border-t border-white/10 text-center">
              {DIAS.map((d) => (
                <div key={d} className="border-b border-r border-white/10 py-2 text-[11px] font-bold uppercase tracking-wide text-white/50">{d}</div>
              ))}
              {celulas.map((d, i) => {
                if (d === null) return <div key={`v-${i}`} className="border-b border-r border-white/10 bg-white/[0.02]" />
                const eventos = mapa[`${mes}-${d}`] || []
                return (
                  <div key={d} className="min-h-[72px] border-b border-r border-white/10 p-1.5 text-left sm:min-h-[92px]">
                    <span className={`text-xs font-semibold ${ehHoje(d) ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white' : 'text-white/80'}`}>
                      {d}
                    </span>
                    <div className="mt-1 space-y-1">
                      {eventos.slice(0, 2).map((e, j) => (
                        <div
                          key={j}
                          title={e.titulo}
                          className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${CORES[e.cor] || CORES.cyan}`}
                        >
                          {e.titulo}
                        </div>
                      ))}
                      {eventos.length > 2 && (
                        <div className="px-1 text-[10px] font-semibold text-white/50">+{eventos.length - 2}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Lista detalhada dos eventos do mês */}
            <div className="border-t border-white/10 p-5">
              {eventosDoMes.length > 0 ? (
                <ul className="space-y-3">
                  {eventosDoMes.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${(CORES[e.cor] || CORES.cyan).split(' ')[0]}`} />
                      <div>
                        <p className="font-display text-sm font-bold text-white">{e.titulo}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/60">
                          <span>{fmtIntervalo(e)}</span>
                          {e.local && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {e.local}
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-2 text-center text-sm text-white/40">Nenhuma competição marcada em {MESES[mes]}.</p>
              )}
            </div>
          </div>
        </Reveal>

        {calendario.nota && (
          <Reveal>
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-navy-400">
              <Info className="h-3.5 w-3.5" />
              {calendario.nota}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
