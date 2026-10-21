import { Globe, ArrowUpRight } from 'lucide-react'
import { handebolMundo } from '../data/content'
import Reveal from './Reveal'

// "Handebol no Brasil e no mundo" — portais oficiais do esporte, cada um com
// um print da home e link para o site.
export default function HandebolMundo() {
  return (
    <section id="handebol-mundo" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {handebolMundo.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {handebolMundo.titulo}
          </h2>
          <p className="mt-4 text-ink/70">{handebolMundo.intro}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {handebolMundo.sites.map((s, i) => (
            <Reveal key={s.nome} delay={0.08 * i}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                  <img
                    src={s.img}
                    alt={`Site da ${s.descricao}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    {s.ambito}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-extrabold text-navy-900">{s.nome}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-ink/70">{s.descricao}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-cyan-700">
                    Visitar o site <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
