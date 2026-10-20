import { Info } from 'lucide-react'
import { projetos } from '../data/content'
import Reveal from './Reveal'

export default function ProjetosDestaque() {
  return (
    <section id="projetos" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            {projetos.eyebrow}
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            {projetos.titulo}
          </h2>
          <p className="mt-4 text-ink/70">{projetos.descricao}</p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {projetos.lista.map((p, i) => (
            <Reveal key={p.nome} delay={0.06 * i}>
              <article className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[220px_1fr]">
                <div className="flex items-center justify-center rounded-2xl bg-navy-50 p-8">
                  <img
                    src={p.logo}
                    alt={p.nome}
                    loading="lazy"
                    className="max-h-28 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-navy-900">{p.nome}</h3>
                  <p className="mt-2 text-sm font-semibold text-cyan-700">{p.resumo}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.texto}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {projetos.nota && (
          <Reveal>
            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-navy-400">
              <Info className="h-3.5 w-3.5" />
              {projetos.nota}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
