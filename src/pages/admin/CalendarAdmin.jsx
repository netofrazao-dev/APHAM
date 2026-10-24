import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, CalendarDays, MapPin } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { calendario } from '../../data/content'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

const CORES = [
  { id: 'cyan', nome: 'Ciano', classe: 'bg-cyan-500' },
  { id: 'amber', nome: 'Âmbar', classe: 'bg-amber-500' },
  { id: 'red', nome: 'Vermelho', classe: 'bg-red-600' },
  { id: 'green', nome: 'Verde', classe: 'bg-[#2faa3a]' },
  { id: 'blue', nome: 'Azul', classe: 'bg-blue-600' },
  { id: 'purple', nome: 'Roxo', classe: 'bg-purple-600' },
]
// Sugestões de categoria (etiqueta colorida do evento na home); pode digitar outra.
const TIPOS = ['Competição', 'Final', 'Evento', 'Ação social', 'Treino', 'Reunião']
const corClasse = (c) => (CORES.find((x) => x.id === c) || CORES[0]).classe

function fmt(e) {
  const d = (s) => (s || '').split('-').reverse().join('/')
  if (e.fim && e.fim !== e.data) return `${d(e.data)} até ${d(e.fim)}`
  return d(e.data)
}

export default function CalendarAdmin() {
  const { settings, updateSettings } = useStore()
  const [eventos, setEventos] = useState(() => settings?.calendarioEventos ?? calendario.eventos)
  const [item, setItem] = useState(null) // { idx, data, fim, titulo, local, tipo, cor }
  const [salvo, setSalvo] = useState(false)

  const persistir = (lista) => {
    setEventos(lista)
    updateSettings({ calendarioEventos: lista })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 1600)
  }

  const salvarItem = (e) => {
    e.preventDefault()
    if (!item.data || !item.titulo) {
      alert('Preencha a data e o título.')
      return
    }
    const ev = {
      data: item.data,
      fim: item.fim || undefined,
      titulo: item.titulo.trim(),
      local: item.local?.trim() || '',
      tipo: item.tipo?.trim() || 'Evento',
      cor: item.cor || 'cyan',
    }
    const lista = [...eventos]
    if (item.idx != null) lista[item.idx] = ev
    else lista.push(ev)
    lista.sort((a, b) => (a.data > b.data ? 1 : -1))
    persistir(lista)
    setItem(null)
  }

  const remover = (idx) => {
    if (!window.confirm('Remover este evento do calendário?')) return
    persistir(eventos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <PageTitle title="Calendário" subtitle="Competições e ações da APHAM — aparecem na home (próximos eventos) e na agenda completa">
        <div className="flex items-center gap-2">
          {salvo && <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"><Check className="h-4 w-4" />Salvo</span>}
          <button type="button" onClick={() => setItem({ data: '', fim: '', titulo: '', local: '', tipo: 'Competição', cor: 'cyan' })} className={btnAccent}>
            <Plus className="h-4 w-4" />
            Novo evento
          </button>
        </div>
      </PageTitle>

      <div className="space-y-3">
        {[...eventos]
          .map((e, idx) => ({ e, idx }))
          .sort((a, b) => (a.e.data > b.e.data ? 1 : -1))
          .map(({ e, idx }) => (
            <Card key={idx} className="flex items-center gap-4 p-3">
              <span className={`h-10 w-2 shrink-0 rounded-full ${corClasse(e.cor)}`} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-sm font-bold text-navy-900">{e.titulo}</h3>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-navy-500">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{fmt(e)}</span>
                  {e.local && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{e.local}</span>}
                  {e.tipo && <span className="rounded bg-navy-100 px-1.5 py-0.5 font-semibold text-navy-700">{e.tipo}</span>}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setItem({ idx, data: e.data, fim: e.fim || '', titulo: e.titulo, local: e.local || '', tipo: e.tipo || 'Evento', cor: e.cor || 'cyan' })} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remover(idx)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        {eventos.length === 0 && <Card className="text-sm text-navy-500">Nenhum evento. Clique em "Novo evento".</Card>}
      </div>

      {item && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvarItem} className="my-8 w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{item.idx != null ? 'Editar evento' : 'Novo evento'}</h2>
              <button type="button" onClick={() => setItem(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data *"><input type="date" required value={item.data} onChange={(e) => setItem((p) => ({ ...p, data: e.target.value }))} className={inputCls} /></Field>
                <Field label="Data de fim" hint="Se durar vários dias"><input type="date" value={item.fim} onChange={(e) => setItem((p) => ({ ...p, fim: e.target.value }))} className={inputCls} /></Field>
              </div>
              <Field label="Título *"><input required value={item.titulo} onChange={(e) => setItem((p) => ({ ...p, titulo: e.target.value }))} className={inputCls} placeholder="TFA — Taça das Fronteiras Amazônicas" /></Field>
              <Field label="Local"><input value={item.local} onChange={(e) => setItem((p) => ({ ...p, local: e.target.value }))} className={inputCls} placeholder="Breves — PA" /></Field>
              <Field label="Categoria" hint="Aparece na etiqueta colorida do evento na home">
                <input list="tipos-evento" value={item.tipo} onChange={(e) => setItem((p) => ({ ...p, tipo: e.target.value }))} className={inputCls} placeholder="Competição" />
                <datalist id="tipos-evento">
                  {TIPOS.map((t) => <option key={t} value={t} />)}
                </datalist>
              </Field>
              <Field label="Cor da etiqueta">
                <div className="flex flex-wrap gap-2">
                  {CORES.map((c) => (
                    <button key={c.id} type="button" onClick={() => setItem((p) => ({ ...p, cor: c.id }))} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${item.cor === c.id ? 'border-navy-800 bg-navy-50' : 'border-navy-200'}`}>
                      <span className={`h-3 w-3 rounded-full ${c.classe}`} />
                      {c.nome}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setItem(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar evento</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
