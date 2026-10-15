import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useStore, slugify } from '../../store/StoreContext'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

export default function CategoriesAdmin() {
  const { categorias, produtos, saveCategoria, deleteCategoria } = useStore()
  const [form, setForm] = useState(null)

  const abrirNovo = () => setForm({ id: '', nome: '', novo: true })
  const abrirEdicao = (c) => setForm({ ...c, novo: false })

  const salvar = (e) => {
    e.preventDefault()
    const nome = form.nome.trim()
    if (!nome) return
    const id = form.novo ? slugify(nome) || `cat-${Date.now().toString(36)}` : form.id
    saveCategoria({ id, nome, icone: form.icone || 'Tags' })
    setForm(null)
  }

  const excluir = (c) => {
    const usados = produtos.filter((p) => p.categoria === c.id).length
    const msg = usados
      ? `A categoria "${c.nome}" está em ${usados} produto(s). Excluir mesmo assim? (os produtos ficam sem categoria)`
      : `Excluir a categoria "${c.nome}"?`
    if (window.confirm(msg)) deleteCategoria(c.id)
  }

  return (
    <div>
      <PageTitle title="Categorias" subtitle="Organize os produtos da loja">
        <button type="button" onClick={abrirNovo} className={btnAccent}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </button>
      </PageTitle>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categorias.map((c) => {
          const total = produtos.filter((p) => p.categoria === c.id).length
          return (
            <Card key={c.id} className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-sm font-bold text-navy-900">{c.nome}</h3>
                <p className="text-xs text-navy-500">{total} produto(s)</p>
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => abrirEdicao(c)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => excluir(c)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {form && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">
                {form.novo ? 'Nova categoria' : 'Editar categoria'}
              </h2>
              <button type="button" onClick={() => setForm(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Field label="Nome *">
              <input required autoFocus value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className={inputCls} />
            </Field>
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
