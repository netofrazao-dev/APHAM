import { Users, Briefcase, Sprout, HeartHandshake, FileText } from 'lucide-react'
import { cooperativa } from '../data/content'
import Reveal from './Reveal'

const ICONES = [Briefcase, HeartHandshake, Sprout]

export default function Cooperativa() {
  return (
    <section id="cooperativa" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <div className="overflow-hidden rounded-[2rem] border border-navy-100 bg-white shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Lado visual */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 p-10 lg:p-12">
              <div className="absolute inset-0 dot-grid opacity-20" />
              <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
              <Reveal className="relative text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200">
                  <Users className="h-8 w-8" />
                </span>
                <img
                  src={cooperativa.img}
                  alt="Cooperativa Social APHAM"
                  loading="lazy"
                  className="mx-auto mt-8 h-32 w-auto object-contain"
                />
              </Reveal>
            </div>

            {/* Conteúdo */}
            <div className="p-8 sm:p-10 lg:p-12">
              <Reveal>
                <span className="eyebrow">
                  <span className="h-px w-6 bg-cyan-400" />
                  {cooperativa.eyebrow}
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                  {cooperativa.titulo}
                </h2>
                <p className="mt-4 text-ink/70">{cooperativa.descricao}</p>
              </Reveal>

              <div className="mt-8 space-y-4">
                {cooperativa.destaques.map((d, i) => {
                  const Ic = ICONES[i % ICONES.length]
                  return (
                    <Reveal key={d.titulo} delay={0.06 * i}>
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                          <Ic className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-bold text-navy-900">{d.titulo}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink/70">{d.texto}</p>
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>

              {cooperativa.docPronto && (
                <Reveal>
                  <a
                    href={cooperativa.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-9"
                  >
                    <FileText className="h-4 w-4" />
                    Ver o documento
                  </a>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
