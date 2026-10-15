import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import { useStore, novoId, slugify } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

const vazio = () => ({ id: '', codigo: '', tipo: 'percent', valor: 10, minimo: 0, ativo: true })

export default function CouponsAdmin() {
  const { cupons, saveCupom, deleteCupom } = useStore()
  const [form, setForm] = useState(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const salvar = (e) => {
    e.preventDefault()
    const codigo = (form.codigo || '').trim().toUpperCase()
    if (!codigo) return
    saveCupom({
      id: form.id || `cup-${slugify(codigo) || novoId().slice(-4)}`,
      codigo,
      tipo: form.tipo,
      valor: Number(form.valor) || 0,
      minimo: Number(form.minimo) || 0,
      ativo: !!form.ativo,
    })
    setForm(null)
  }

  const excluir = (c) => window.confirm(`Excluir o cupom ${c.codigo}?`) && deleteCupom(c.id)

  return (
    <div>
      <PageTitle title="Cupons" subtitle="Descontos para a loja">
        <button type="button" onClick={() => setForm(vazio())} className={btnAccent}>
          <Plus className="h-4 w-4" />
          Novo cupom
        </button>
      </PageTitle>

      {cupons.length === 0 ? (
        <Card className="text-sm text-navy-500">Nenhum cupom cadastrado.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cupons.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${c.ativo ? 'bg-cyan-100 text-cyan-700' : 'bg-navy-100 text-navy-400'}`}>
                  <Tag className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-navy-900">{c.codigo}</h3>
                  <p className="text-xs text-navy-500">
                    {c.tipo === 'percent' ? `${c.valor}% de desconto` : `${formatBRL(c.valor)} de desconto`}
                    {c.minimo ? ` · mín. ${formatBRL(c.minimo)}` : ''} · {c.ativo ? 'ativo' : 'inativo'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setForm(c)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => excluir(c)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{form.id ? 'Editar cupom' : 'Novo cupom'}</h2>
              <button type="button" onClick={() => setForm(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Código *"><input required value={form.codigo} onChange={(e) => set('codigo', e.target.value.toUpperCase())} className={inputCls} placeholder="APHAM10" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo">
                  <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className={inputCls}>
                    <option value="percent">Percentual (%)</option>
                    <option value="valor">Valor (R$)</option>
                  </select>
                </Field>
                <Field label={form.tipo === 'percent' ? 'Desconto (%)' : 'Desconto (R$)'}>
                  <input type="number" min="0" step="0.01" value={form.valor} onChange={(e) => set('valor', e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Pedido mínimo (R$)" hint="0 = sem mínimo"><input type="number" min="0" step="0.01" value={form.minimo} onChange={(e) => set('minimo', e.target.value)} className={inputCls} /></Field>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
                <input type="checkbox" checked={form.ativo} onChange={(e) => set('ativo', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
                Ativo
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
