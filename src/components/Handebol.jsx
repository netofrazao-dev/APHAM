import { Trophy, MapPin, Users, Info } from 'lucide-react'
import { handebol } from '../data/content'
import Reveal from './Reveal'

const ICONES = { Trophy, MapPin, Users }

export default function Handebol() {
  return (
    <section id="handebol" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {handebol.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {handebol.titulo}
          </h2>
          <p className="mt-4 text-ink/70">{handebol.intro}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {handebol.topicos.map((t, i) => {
            const Ic = ICONES[t.icone] || Info
            return (
              <Reveal key={t.titulo} delay={0.08 * i}>
                <div className="group h-full rounded-2xl border border-navy-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lift">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-700 transition-colors duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                    <Ic className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{t.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{t.texto}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {handebol.nota && (
          <Reveal>
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-navy-400">
              <Info className="h-3.5 w-3.5" />
              {handebol.nota}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
