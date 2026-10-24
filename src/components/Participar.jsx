import { MessageCircle, ClipboardList, Users, CalendarClock, MapPin, Clock, Info } from 'lucide-react'
import { participar, site } from '../data/content'
import Reveal from './Reveal'

const ICONES = { MessageCircle, ClipboardList, Users }

export default function Participar() {
  return (
    <section id="participar" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {participar.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {participar.titulo}
          </h2>
          <p className="mt-4 text-ink/70">{participar.descricao}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Horários */}
          <Reveal>
            <div className="h-full rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-bold text-navy-900">Horários de treino</h3>
              </div>

              <ul className="mt-6 divide-y divide-navy-100">
                {participar.horarios.map((h) => (
                  <li key={h.turma} className="py-4 first:pt-0 last:pb-0">
                    <p className="font-display text-base font-bold text-navy-900">{h.turma}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink/70">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarClock className="h-4 w-4 text-cyan-600" />
                        {h.dias}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-cyan-600" />
                        {h.horario}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                        {h.local}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {participar.provisorio && (
                <p className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Horários provisórios — confirme a turma e o horário com a associação antes de ir ao
                  treino.
                </p>
              )}
            </div>
          </Reveal>

          {/* Como participar */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col">
              <ol className="space-y-5">
                {participar.passos.map((p, i) => {
                  const Ic = ICONES[p.icone] || Users
                  return (
                    <li key={p.titulo} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
                      <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white">
                        <Ic className="h-5 w-5" />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <h4 className="font-display text-base font-bold text-navy-900">{p.titulo}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-ink/70">{p.texto}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <div className="mt-6 rounded-2xl bg-navy-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                  Para o primeiro dia
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
                  {participar.requisitos.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 w-full sm:w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                Quero participar
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
