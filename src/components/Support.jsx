import { ArrowRight } from 'lucide-react'
import { apoio } from '../data/content'
import Reveal from './Reveal'
import Icon from './Icon'

export default function Support() {
  return (
    <section id="apoie" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-lift">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                {apoio.eyebrow}
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                {apoio.titulo}
              </h2>
              <p className="mt-4 max-w-md text-white/90">{apoio.texto}</p>
              <a
                href="#contato"
                className="btn mt-8 bg-white text-cyan-700 shadow-soft hover:-translate-y-0.5 hover:bg-navy-50"
              >
                Quero apoiar
                <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>

            <div className="grid gap-4">
              {apoio.formas.map((f, i) => (
                <Reveal key={f.titulo} delay={0.08 * i}>
                  <div className="flex items-start gap-4 rounded-2xl bg-white/12 p-5 backdrop-blur-sm transition-colors hover:bg-white/20">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600">
                      <Icon name={f.icone} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-white">{f.titulo}</h3>
                      <p className="mt-1 text-sm text-white/85">{f.texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
