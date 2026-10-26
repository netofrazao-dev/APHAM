import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, PauseCircle, PlayCircle, ExternalLink, Wallet, MessageCircle, Mail, MapPin, Instagram, KeyRound, Package, Percent } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { STATUS_LOJA, saldoDaLoja, urlLoja, arred } from '../../store/lojas'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

const ABAS = [
  { id: 'pendente', label: 'Em análise' },
  { id: 'aprovada', label: 'Aprovadas' },
  { id: 'suspensa', label: 'Suspensas' },
  { id: 'recusada', label: 'Recusadas' },
]

const soDigitos = (s) => (s || '').replace(/\D/g, '')

function Repasse({ loja, saldo, onFeito }) {
  const { registrarRepasse } = useStore()
  const [valor, setValor] = useState(saldo.aReceber > 0 ? String(saldo.aReceber) : '')
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().slice(0, 10))
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)
  const salvar = async (e) => {
    e.preventDefault()
    const v = arred(valor)
    if (!(v > 0)) return alert('Informe o valor pago.')
    setSalvando(true)
    const ok = await registrarRepasse({ lojaId: loja.id, valor: v, dataPagamento, obs })
    setSalvando(false)
    if (!ok) return alert('Não foi possível registrar o repasse.')
    onFeito()
  }
  return (
    <form onSubmit={salvar} className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
      <Field label="Valor pago (R$)">
        <input type="number" step="0.01" min="0.01" required value={valor} onChange={(e) => setValor(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Data do PIX">
        <input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Observação">
        <input value={obs} onChange={(e) => setObs(e.target.value)} className={inputCls} placeholder="Ex.: pedidos de outubro" />
      </Field>
      <button type="submit" disabled={salvando} className={btnPrimary}>
        {salvando ? 'Salvando...' : 'Registrar'}
      </button>
    </form>
  )
}

function LojaCard({ loja }) {
  const { definirStatusLoja, orders, repasses, produtos } = useStore()
  const [repasseAberto, setRepasseAberto] = useState(false)
  const st = STATUS_LOJA[loja.status] || STATUS_LOJA.pendente
  const saldo = useMemo(() => saldoDaLoja(orders, repasses, loja.id), [orders, repasses, loja.id])
  const qtdProdutos = produtos.filter((p) => p.lojaId === loja.id).length
  const historico = repasses.filter((r) => r.lojaId === loja.id)

  const mudar = async (status, pergunta) => {
    if (pergunta && !window.confirm(pergunta)) return
    const ok = await definirStatusLoja(loja.id, status)
    if (!ok) alert('Não foi possível atualizar a loja.')
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-100 font-display text-xl font-extrabold text-navy-700">
          {loja.logo ? <img src={loja.logo} alt="" className="h-full w-full object-cover" /> : (loja.nome || '?').slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-extrabold text-navy-900">{loja.nome}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${st.cor}`}>{st.label}</span>
          </div>
          <p className="text-sm text-navy-600">
            {loja.responsavel}
            {loja.criadaEm && <span className="text-navy-400"> · pedido em {new Date(loja.criadaEm).toLocaleDateString('pt-BR')}</span>}
          </p>
          {loja.descricao && <p className="mt-2 text-sm leading-relaxed text-ink/75">{loja.descricao}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-600">
            {loja.whatsapp && (
              <a href={`https://wa.me/55${soDigitos(loja.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-700">
                <MessageCircle className="h-3.5 w-3.5" />
                {loja.whatsapp}
              </a>
            )}
            {loja.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {loja.email}
              </span>
            )}
            {loja.cidade && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {loja.cidade}
              </span>
            )}
            {loja.instagram && (
              <span className="inline-flex items-center gap-1">
                <Instagram className="h-3.5 w-3.5" />
                {loja.instagram}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <KeyRound className="h-3.5 w-3.5" />
              PIX: {loja.pixChave || '—'} {loja.pixTitular && `(${loja.pixTitular})`}
            </span>
            <span className="inline-flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {qtdProdutos} produto(s)
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {loja.status === 'pendente' && (
            <>
              <button type="button" onClick={() => mudar('aprovada')} className={btnAccent}>
                <Check className="h-4 w-4" />
                Aprovar
              </button>
              <button type="button" onClick={() => mudar('recusada', `Recusar a loja "${loja.nome}"?`)} className={btnGhost}>
                <X className="h-4 w-4" />
                Recusar
              </button>
            </>
          )}
          {loja.status === 'aprovada' && (
            <>
              <Link to={urlLoja(loja)} target="_blank" className={btnGhost}>
                <ExternalLink className="h-4 w-4" />
                Ver loja
              </Link>
              <button type="button" onClick={() => mudar('suspensa', `Suspender "${loja.nome}"? Os produtos saem da loja até reativar.`)} className={btnGhost}>
                <PauseCircle className="h-4 w-4" />
                Suspender
              </button>
            </>
          )}
          {(loja.status === 'suspensa' || loja.status === 'recusada') && (
            <button type="button" onClick={() => mudar('aprovada')} className={btnAccent}>
              <PlayCircle className="h-4 w-4" />
              {loja.status === 'suspensa' ? 'Reativar' : 'Aprovar'}
            </button>
          )}
        </div>
      </div>

      {/* Financeiro */}
      {(loja.status === 'aprovada' || loja.status === 'suspensa' || saldo.pedidos.length > 0) && (
        <div className="mt-5 border-t border-navy-100 pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ['Vendas pagas', saldo.qtdPagos],
              ['Clientes pagaram', formatBRL(saldo.cliente)],
              ['Parte da APHAM', formatBRL(saldo.apham)],
              ['Já repassado', formatBRL(saldo.repassado)],
              ['A repassar', formatBRL(saldo.aReceber)],
            ].map(([r, v], i) => (
              <div key={r} className={`rounded-xl p-3 ${i === 4 && saldo.aReceber > 0 ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-navy-50'}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">{r}</p>
                <p className="mt-0.5 font-display text-base font-extrabold text-navy-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setRepasseAberto((v) => !v)} className={btnGhost}>
              <Wallet className="h-4 w-4" />
              {repasseAberto ? 'Fechar' : 'Registrar repasse'}
            </button>
            {historico.length > 0 && (
              <span className="text-xs text-navy-500">
                Último repasse: {formatBRL(historico[0].valor)}
                {historico[0].dataPagamento && ` em ${historico[0].dataPagamento.split('-').reverse().join('/')}`}
              </span>
            )}
          </div>
          {repasseAberto && <Repasse loja={loja} saldo={saldo} onFeito={() => setRepasseAberto(false)} />}
          {historico.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-semibold text-navy-700">Histórico de repasses ({historico.length})</summary>
              <ul className="mt-2 space-y-1">
                {historico.map((r) => (
                  <li key={r.id} className="flex flex-wrap justify-between gap-2 rounded-lg bg-navy-50 px-3 py-2 text-navy-700">
                    <span>{r.dataPagamento ? r.dataPagamento.split('-').reverse().join('/') : new Date(r.criadoEm).toLocaleDateString('pt-BR')}{r.obs && ` · ${r.obs}`}</span>
                    <strong>{formatBRL(r.valor)}</strong>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </Card>
  )
}

export default function LojasAdmin() {
  const { lojas, comissao, updateSettings, marketplaceOk, supabaseAtivo } = useStore()
  const [aba, setAba] = useState(() => (lojas.some((l) => l.status === 'pendente') ? 'pendente' : 'aprovada'))
  const [pct, setPct] = useState(String(comissao))
  const lista = lojas.filter((l) => l.status === aba)

  return (
    <div>
      <PageTitle title="Lojas parceiras" subtitle="Lojistas que vendem dentro da loja da APHAM" />

      {supabaseAtivo && !marketplaceOk && (
        <Card className="mb-5 border-amber-200 bg-amber-50 text-sm text-amber-900">
          Para ativar as lojas parceiras, rode o script <strong>supabase/lojas-parceiras.sql</strong> no Supabase (SQL Editor). Ele também
          corrige a segurança do painel.
        </Card>
      )}

      <Card className="mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <p className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
            <Percent className="h-4 w-4 text-cyan-600" />
            Parte da APHAM
          </p>
          <p className="mt-1 text-sm text-navy-500">
            Somada ao preço que o lojista define. Ex.: lojista pede R$ 100 → cliente paga R$ {(100 * (1 + (Number(pct) || 0) / 100)).toFixed(2).replace('.', ',')}.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <Field label="Comissão (%)">
            <input type="number" min="0" max="100" step="0.5" value={pct} onChange={(e) => setPct(e.target.value)} className={`${inputCls} w-28`} />
          </Field>
          <button
            type="button"
            onClick={() => {
              updateSettings({ comissaoLojas: Math.max(0, Number(pct) || 0) })
              alert('Comissão atualizada. Vale para os próximos pedidos.')
            }}
            className={btnPrimary}
          >
            Salvar
          </button>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {ABAS.map((a) => {
          const n = lojas.filter((l) => l.status === a.id).length
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${aba === a.id ? 'bg-navy-900 text-white' : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50'}`}
            >
              {a.label} {n > 0 && <span className={a.id === 'pendente' ? 'ml-1 rounded-full bg-amber-400 px-1.5 text-navy-950' : 'ml-1 opacity-70'}>{n}</span>}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {lista.map((l) => (
          <LojaCard key={l.id} loja={l} />
        ))}
        {lista.length === 0 && (
          <Card className="text-sm text-navy-500">
            Nenhuma loja aqui. O link para os lojistas pedirem cadastro é <strong>/vender</strong>.
          </Card>
        )}
      </div>
    </div>
  )
}
