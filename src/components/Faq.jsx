import { useState } from 'react'
import { Plus, HelpCircle } from 'lucide-react'
import { faq } from '../data/content'
import Reveal from './Reveal'

export default function Faq() {
  const [aberto, setAberto] = useState(0)

  return (
    <section id="faq" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Perguntas frequentes
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Ainda tem dúvidas?
          </h2>
          <p className="mt-4 text-ink/70">
            Reunimos as perguntas mais comuns de quem quer treinar, apoiar ou conhecer a APHAM.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faq.map((item, i) => {
            const isOpen = aberto === i
            return (
              <Reveal key={item.pergunta} delay={0.04 * i}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                    isOpen ? 'border-cyan-200 shadow-soft' : 'border-navy-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setAberto(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <HelpCircle
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isOpen ? 'text-cyan-600' : 'text-navy-400'
                      }`}
                    />
                    <span className="flex-1 font-display text-base font-bold text-navy-900">
                      {item.pergunta}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-navy-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-14 text-sm leading-relaxed text-ink/70 sm:px-6 sm:pl-16">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
