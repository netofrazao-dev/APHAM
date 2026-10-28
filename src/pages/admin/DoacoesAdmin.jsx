import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, AlertTriangle, ExternalLink } from 'lucide-react'
import { useStore, novoId } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { TIPOS_DOADOR, dataBR, hojeISO } from '../../lib/doacoes'
import { incentivoFolder } from '../../data/folders'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

const vazia = () => ({ nome: '', tipo: 'pf', valor: '', data: hojeISO(), anonimo: false, mostrarValor: true })

// "1.234,56" / "2.000" / "1234.56" / "1234" → número (ponto como milhar, no jeito brasileiro)
function lerValor(txt) {
  const t = String(txt).trim().replace(/[^\d,.-]/g, '')
  const milhar = t.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(t)
  const n = milhar ? Number(t.replace(/\./g, '').replace(',', '.')) : Number(t)
  return Number.isFinite(n) ? n : NaN
}

export default function DoacoesAdmin() {
  const { doacoes, doacoesOk, saveDoacao, deleteDoacao } = useStore()
  const [doacao, setDoacao] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const meta = incentivoFolder.metaCaptacao
  const lista = [...doacoes].sort((a, b) => (b.data || '').localeCompare(a.data || ''))
  const total = doacoes.reduce((t, d) => t + (Number(d.valor) || 0), 0)
  const set = (k) => (e) => setDoacao((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const salvar = async (e) => {
    e.preventDefault()
    const valor = lerValor(doacao.valor)
    if (!(valor > 0)) {
      alert('Informe o valor da doação (ex.: 1.500,00).')
      return
    }
    setSalvando(true)
    const ok = await saveDoacao({ ...doacao, id: doacao.id || novoId('doacao'), nome: doacao.nome.trim(), valor })
    setSalvando(false)
    if (!ok) {
      alert('Não foi possível salvar. Confira se o script supabase/doacoes.sql já foi rodado no Supabase.')
      return
    }
    setDoacao(null)
  }

  return (
    <div>
      <PageTitle title="Doações" subtitle="Painel de doações da Lei de Incentivo ao Esporte">
        <button type="button" onClick={() => setDoacao(vazia())} className={btnAccent}>
          <Plus className="h-4 w-4" />
          Nova doação
        </button>
      </PageTitle>

      {!doacoesOk && (
        <Card className="mb-6 flex gap-3 border-amber-200 bg-amber-50 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>
            Falta preparar o banco: rode o arquivo <strong>supabase/doacoes.sql</strong> no Supabase (SQL Editor &gt; New
            query &gt; Run). Depois disso, as doações cadastradas aqui aparecem no site.
          </p>
        </Card>
      )}

      <Card className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Arrecadado</p>
            <p className="font-display text-2xl font-extrabold text-navy-900">{formatBRL(total)}</p>
            <p className="text-sm text-navy-500">
              {doacoes.length} {doacoes.length === 1 ? 'doação' : 'doações'} · meta {formatBRL(meta)} (
              {((total / meta) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%)
            </p>
          </div>
          <Link to="/incentivo#doacoes" target="_blank" className={btnGhost}>
            <ExternalLink className="h-4 w-4" />
            Ver no site
          </Link>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-navy-500">
          Atualize uma vez por semana com as doações que entraram na Conta Captação. O painel aparece na página da Lei
          de Incentivo assim que a primeira doação é cadastrada. Marque <strong>anônima</strong> quando o doador não
          autorizar a divulgação do nome: o site mostra “Doador anônimo”, mas o valor continua no total.
        </p>
      </Card>

      <div className="space-y-3">
        {lista.map((d) => (
          <Card key={d.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-sm font-bold text-navy-900">{d.nome}</h3>
              <p className="text-xs text-navy-500">
                {TIPOS_DOADOR[d.tipo]} · {dataBR(d.data)}
                {d.anonimo && <span className="ml-2 font-semibold text-amber-700">anônima no site</span>}
                {!d.mostrarValor && <span className="ml-2 font-semibold text-navy-400">valor oculto</span>}
              </p>
            </div>
            <p className="shrink-0 font-display text-sm font-extrabold text-navy-900">{formatBRL(d.valor)}</p>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => setDoacao({ ...d, valor: String(d.valor).replace('.', ',') })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => window.confirm('Remover esta doação?') && deleteDoacao(d.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
        {lista.length === 0 && <Card className="text-sm text-navy-500">Nenhuma doação cadastrada ainda.</Card>}
      </div>

      {doacao && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="my-8 w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">
                {doacao.id ? 'Editar doação' : 'Nova doação'}
              </h2>
              <button
                type="button"
                onClick={() => setDoacao(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Nome do doador *" hint="Pessoa ou empresa, como deve aparecer no site.">
                <input required value={doacao.nome} onChange={set('nome')} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo">
                  <select value={doacao.tipo} onChange={set('tipo')} className={inputCls}>
                    {Object.entries(TIPOS_DOADOR).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Data da doação *">
                  <input required type="date" value={doacao.data} onChange={set('data')} className={inputCls} />
                </Field>
              </div>
              <Field label="Valor (R$) *">
                <input
                  required
                  inputMode="decimal"
                  value={doacao.valor}
                  onChange={set('valor')}
                  className={inputCls}
                  placeholder="1.500,00"
                />
              </Field>
              <label className="flex items-start gap-3 text-sm text-navy-800">
                <input type="checkbox" checked={doacao.anonimo} onChange={set('anonimo')} className="mt-0.5 h-4 w-4" />
                <span>
                  <strong>Doação anônima</strong> — o doador não autorizou mostrar o nome (aparece “Doador anônimo”).
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-navy-800">
                <input
                  type="checkbox"
                  checked={doacao.mostrarValor}
                  onChange={set('mostrarValor')}
                  className="mt-0.5 h-4 w-4"
                />
                <span>
                  <strong>Mostrar o valor no site</strong> — desmarque para mostrar só o nome (o valor ainda soma no
                  total).
                </span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDoacao(null)} className={btnGhost}>
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className={btnPrimary}>
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
