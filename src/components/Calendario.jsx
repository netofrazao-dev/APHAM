import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Info, CalendarDays } from 'lucide-react'
import { calendario } from '../data/content'
import Reveal from './Reveal'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const ANO = calendario.ano || 2026

// Agrupa os eventos do ano por dia (chave "mes-dia").
function eventosPorDia() {
  const map = {}
  for (const e of calendario.eventos || []) {
    const [a, m, d] = (e.data || '').split('-').map(Number)
    if (a !== ANO || !m || !d) continue
    const k = `${m - 1}-${d}`
    ;(map[k] = map[k] || []).push({ ...e, dia: d, mes: m - 1 })
  }
  return map
}

export default function Calendario() {
  const hoje = new Date()
  const mesInicial = hoje.getFullYear() === ANO ? hoje.getMonth() : 0
  const [mes, setMes] = useState(mesInicial)
  const mapa = eventosPorDia()

  const primeiroDiaSemana = new Date(ANO, mes, 1).getDay()
  const diasNoMes = new Date(ANO, mes + 1, 0).getDate()
  const celulas = []
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null)
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d)

  const ehHoje = (d) => hoje.getFullYear() === ANO && hoje.getMonth() === mes && hoje.getDate() === d

  // Eventos do mês selecionado, ordenados por dia.
  const eventosDoMes = Object.values(mapa)
    .flat()
    .filter((e) => e.mes === mes)
    .sort((a, b) => a.dia - b.dia)

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
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-lift">
            {/* Cabeçalho do mês com navegação */}
            <div className="flex items-center justify-between bg-navy-950 px-5 py-4 text-white">
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
                <p className="font-display text-lg font-extrabold">{MESES[mes]}</p>
                <p className="text-xs text-white/60">{ANO}</p>
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

            {/* Grade de dias */}
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-7 gap-1 text-center">
                {DIAS.map((d) => (
                  <div key={d} className="py-1.5 text-xs font-bold uppercase tracking-wide text-navy-400">{d}</div>
                ))}
                {celulas.map((d, i) => {
                  if (d === null) return <div key={`v-${i}`} />
                  const eventos = mapa[`${mes}-${d}`]
                  const temEvento = !!eventos
                  return (
                    <div
                      key={d}
                      className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm ${
                        temEvento
                          ? 'bg-cyan-500 font-bold text-white shadow-soft'
                          : ehHoje(d)
                            ? 'bg-navy-100 font-bold text-navy-900 ring-1 ring-navy-300'
                            : 'text-navy-700'
                      }`}
                      title={temEvento ? eventos.map((e) => e.titulo).join(' · ') : undefined}
                    >
                      {d}
                      {temEvento && <span className="mt-0.5 h-1 w-1 rounded-full bg-white" />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Eventos do mês */}
            <div className="border-t border-navy-100 p-5">
              {eventosDoMes.length > 0 ? (
                <ul className="space-y-3">
                  {eventosDoMes.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-cyan-500 text-white">
                        <span className="text-sm font-extrabold leading-none">{e.dia}</span>
                        <span className="text-[9px] uppercase leading-none">{MESES[mes].slice(0, 3)}</span>
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-navy-900">{e.titulo}</p>
                        {e.local && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
                            <MapPin className="h-3 w-3" />
                            {e.local}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex items-center justify-center gap-2 py-2 text-center text-sm text-navy-400">
                  <CalendarDays className="h-4 w-4" />
                  Nenhuma competição marcada em {MESES[mes]}.
                </p>
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
