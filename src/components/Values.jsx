import { valores, citacao } from '../data/content'
import Reveal from './Reveal'
import Icon from './Icon'

export default function Values() {
  return (
    <section className="section-pad py-20">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Nossos valores
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            O que nos move
          </h2>
          <p className="mt-4 text-ink/70">
            Mais do que resultados na quadra, carregamos princípios que formam pessoas.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v, i) => (
            <Reveal key={v.titulo} delay={0.08 * i}>
              <div className="group h-full rounded-2xl border border-navy-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lift">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-700 transition-colors duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                  <Icon name={v.icone} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{v.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Citação */}
        <Reveal delay={0.1}>
          <figure className="mx-auto mt-16 max-w-3xl text-center">
            <blockquote className="font-display text-2xl font-bold leading-snug text-navy-900 sm:text-3xl">
              “{citacao.texto}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold uppercase tracking-wide text-cyan-600">
              {citacao.autor}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
