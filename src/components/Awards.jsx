import { Award, ArrowUpRight, FileText } from 'lucide-react'
import { reconhecimentos, apoios } from '../data/content'
import Reveal from './Reveal'

export default function Awards() {
  return (
    <section id="reconhecimentos" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Reconhecimentos e credenciais
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            O trabalho da APHAM reconhecido
          </h2>
          <p className="mt-4 text-ink/70">
            Prêmios, certificações e respaldo oficial que atestam a seriedade e o impacto do nosso
            projeto no Marajó.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reconhecimentos.map((r, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
                <div className="flex h-44 items-center justify-center bg-navy-50 p-5">
                  <img
                    src={r.img}
                    alt={r.titulo}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-navy-900">{r.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{r.descricao}</p>
                  {r.docPronto ? (
                    <a
                      href={r.doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                    >
                      Ver documento
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy-400">
                      <FileText className="h-4 w-4" />
                      Documento em breve
                    </span>
                  )}
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
                    loading="lazy"
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
