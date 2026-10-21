import { CalendarDays, MapPin, Check, Clock, Info } from 'lucide-react'
import { calendario } from '../data/content'
import Reveal from './Reveal'

// Calendário da APHAM — o que já aconteceu e o que está por vir.
export default function Calendario() {
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

        <div className="mx-auto mt-14 max-w-3xl">
          <ol className="relative space-y-4 border-l-2 border-navy-100 pl-6">
            {calendario.eventos.map((e, i) => {
              const futuro = e.status === 'futuro'
              return (
                <Reveal key={i} delay={0.06 * i}>
                  <li className="relative">
                    {/* marcador na linha */}
                    <span
                      className={`absolute -left-[31px] top-4 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-paper ${
                        futuro ? 'bg-cyan-500 text-white' : 'bg-[#2faa3a] text-white'
                      }`}
                    >
                      {futuro ? <Clock className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                    </span>
                    <div className="flex flex-col gap-2 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm font-bold text-navy-900">
                            {[e.mes, e.data].filter(Boolean).join(' · ') || 'Data a confirmar'}
                          </span>
                        </div>
                        <h3 className="mt-1.5 font-display text-base font-bold text-navy-900">{e.titulo}</h3>
                        {e.local && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
                            <MapPin className="h-3 w-3" />
                            {e.local}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          futuro ? 'bg-cyan-50 text-cyan-700' : 'bg-green-50 text-[#2faa3a]'
                        }`}
                      >
                        {futuro ? 'Em breve' : 'Já aconteceu'}
                      </span>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </div>

        {calendario.nota && (
          <Reveal>
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-navy-400">
              <Info className="h-3.5 w-3.5" />
              {calendario.nota}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
