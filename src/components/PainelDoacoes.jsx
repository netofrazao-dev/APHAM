import { useState } from 'react'
import { HeartHandshake, Building2, User, ChevronDown, RefreshCw } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { formatBRL } from '../store/format'
import { TIPOS_DOADOR, dataBR } from '../lib/doacoes'
import Reveal from './Reveal'

const VISIVEIS = 12

// Painel de doações da Lei de Incentivo (página /incentivo). Os dados vêm do
// painel admin (Doações) e só aparece depois que a primeira doação é cadastrada.
export default function PainelDoacoes({ meta }) {
  const { painelDoacoes: p } = useStore()
  const [todas, setTodas] = useState(false)
  if (!p?.quantidade) return null

  const pct = meta ? Math.min(100, (p.total / meta) * 100) : 0
  const itens = todas ? p.itens : p.itens.slice(0, VISIVEIS)

  return (
    <section id="doacoes" className="section-pad relative overflow-hidden bg-navy-950 py-16 text-white lg:py-20">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center text-cyan-300">
            <span className="h-px w-6 bg-cyan-400" />
            Painel de doações
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Quem já apoia a Escola de Esportes
          </h2>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizado semanalmente
            </span>
            {p.atualizadoEm && <span>· última atualização em {dataBR(p.atualizadoEm)}</span>}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Arrecadado</p>
                <p className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{formatBRL(p.total)}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  {p.quantidade === 1 ? '1 doação' : `${p.quantidade} doações`}
                </p>
                {meta > 0 && <p className="mt-1 text-sm text-white/60">Meta: {formatBRL(meta)}</p>}
              </div>
            </div>
            {meta > 0 && (
              <>
                <div
                  className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso da captação"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                    style={{ width: `${Math.max(pct, 1)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-white/70">
                  {pct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% do valor autorizado pelo Ministério do
                  Esporte
                </p>
              </>
            )}
          </div>
        </Reveal>

        <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((d, i) => {
            const Ic = d.tipo === 'pj' ? Building2 : User
            return (
              <li key={d.id}>
                <Reveal delay={0.03 * (i % VISIVEIS)} className="h-full">
                  <div className="flex h-full items-center gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                      {d.nome ? <Ic className="h-5 w-5" /> : <HeartHandshake className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{d.nome || 'Doador anônimo'}</p>
                      <p className="text-xs text-white/55">
                        {[TIPOS_DOADOR[d.tipo], dataBR(d.data)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {d.valor != null && (
                      <p className="shrink-0 font-display text-sm font-extrabold text-cyan-300">{formatBRL(d.valor)}</p>
                    )}
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>

        {p.itens.length > VISIVEIS && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setTodas((v) => !v)}
              aria-expanded={todas}
              className="btn border border-white/20 text-white hover:bg-white/10"
            >
              {todas ? 'Mostrar menos' : `Ver todos os ${p.itens.length} doadores`}
              <ChevronDown className={`h-4 w-4 transition-transform ${todas ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/50">
          O nome só aparece com autorização do doador. Todos os valores entram no total arrecadado.
        </p>
      </div>
    </section>
  )
}
