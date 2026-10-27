import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Landmark, MessageCircle, ArrowUpRight } from 'lucide-react'
import { doacao, site } from '../data/content'
import Reveal from './Reveal'

// Dados da conta para doações (página Apoie), com botão de copiar cada dado.
function Dado({ rotulo, valor, copiar }) {
  const [ok, setOk] = useState(false)
  const copiarValor = async () => {
    try {
      await navigator.clipboard.writeText(copiar ?? valor)
      setOk(true)
      setTimeout(() => setOk(false), 1600)
    } catch {
      /* sem permissão: ignora */
    }
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">{rotulo}</p>
        <p className="mt-1 select-all whitespace-nowrap font-display text-lg font-extrabold text-white sm:text-xl">{valor}</p>
      </div>
      <button
        type="button"
        onClick={copiarValor}
        aria-label={`Copiar ${rotulo.toLowerCase()}`}
        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/20"
      >
        {ok ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
        {ok ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

export default function Doacao() {
  return (
    <section id="doacao" className="section-pad scroll-mt-24 pb-24 lg:pb-28">
      <div className="container-x max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Doação
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Faça sua doação</h2>
          <p className="mt-4 text-ink/70">
            Qualquer valor ajuda a manter os treinos, os projetos e as ações sociais da APHAM. Faça uma transferência para a conta oficial da associação:
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 overflow-hidden rounded-3xl bg-navy-950 shadow-lift">
            <div className="flex items-center gap-4 border-b border-white/10 bg-[#005ca9] px-6 py-5 sm:px-8">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#005ca9]">
                <Landmark className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-xl font-extrabold text-white">{doacao.banco}</p>
                <p className="text-sm text-white/80">{doacao.tipo}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:p-8">
              <Dado rotulo="Agência" valor={doacao.agencia} />
              <Dado rotulo="Conta corrente" valor={doacao.conta} />
              <Dado rotulo="CNPJ" valor={doacao.cnpj} copiar={doacao.cnpj.replace(/\D/g, '')} />
              <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Titular</p>
                <p className="mt-1 font-display text-base font-extrabold leading-snug text-white">{doacao.titular}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-[#25d366] text-white hover:bg-[#1ebe5b]">
              <MessageCircle className="h-4 w-4" />
              Fale com a APHAM no WhatsApp
            </a>
            <p className="max-w-xl text-sm text-ink/60">
              Quer destinar parte do seu Imposto de Renda? Isso é feito por outra conta, a do projeto aprovado na{' '}
              <Link to="/incentivo" className="inline-flex items-center gap-0.5 font-semibold text-cyan-700 hover:text-cyan-800">
                Lei de Incentivo ao Esporte
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
