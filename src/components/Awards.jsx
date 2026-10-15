import { Award } from 'lucide-react'
import { reconhecimentos, apoios } from '../data/content'
import Reveal from './Reveal'

export default function Awards() {
  return (
    <section id="reconhecimentos" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Reconhecimentos
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Nosso trabalho reconhecido
          </h2>
          <p className="mt-4 text-ink/70">
            A APHAM já foi semifinalista do Prêmio Itaú-Unicef, uma das mais importantes premiações
            de educação e esporte do país.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {reconhecimentos.map((r, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
                <div className="flex items-center justify-center bg-navy-50 p-5">
                  <img src={r.img} alt={r.titulo} loading="lazy" decoding="async" className="h-56 w-auto rounded-lg object-contain shadow-soft" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-navy-900">{r.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{r.descricao}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {apoios.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl bg-navy-50 px-6 py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-500">
                Apoio institucional
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {apoios.map((a) => (
                  <img
                    key={a.nome}
                    src={a.logo}
                    alt={a.nome}
                    className="h-14 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
