import { Landmark, ArrowRight, Check } from 'lucide-react'
import { site } from '../data/content'
import Reveal from './Reveal'

const pontos = [
  'Pessoas físicas e empresas podem destinar parte do Imposto de Renda devido.',
  'Sem custo adicional: o valor já seria pago ao governo de qualquer forma.',
  'O recurso vai direto para o esporte e a formação da juventude marajoara.',
]

export default function TaxIncentive() {
  return (
    <section id="incentivo" className="section-pad pb-8">
      <div className="container-x">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 rounded-[2rem] border border-navy-100 bg-white p-8 shadow-soft sm:p-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-700">
                <Landmark className="h-3.5 w-3.5" />
                Incentivo Fiscal
              </span>
              <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Apoie com parte do seu Imposto de Renda
              </h2>
              <p className="mt-4 text-ink/75">
                A APHAM pode ser apoiada pela <strong>Lei de Incentivo ao Esporte</strong>: você
                direciona parte do seu IR para o nosso projeto — e ajuda o handebol do Marajó sem
                tirar do bolso.
              </p>
              <ul className="mt-6 space-y-3">
                {pontos.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-ink/80">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <a href="#contato" className="btn-primary mt-8">
                Quero destinar meu IR
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-4 text-xs text-navy-400">
                Fale com a gente pelo contato ou WhatsApp que explicamos o passo a passo. Regras e
                limites conforme a legislação vigente.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-2xl bg-navy-50 p-8 text-center">
              <img
                src="/midia/marca/lei-incentivo-esporte.jpg"
                alt="Lei de Incentivo ao Esporte"
                loading="lazy"
                className="h-16 w-auto object-contain sm:h-20"
              />
              <p className="max-w-xs text-sm text-navy-600">
                A APHAM é habilitada a receber recursos pela Lei de Incentivo ao Esporte.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
