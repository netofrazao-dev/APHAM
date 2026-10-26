import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, X, Upload, Image as ImageIcon } from 'lucide-react'
import { useStore, slugify, novoId } from '../../store/StoreContext'
import { formatBRL, precoFinal } from '../../store/format'
import { fileToOptimizedDataURL } from '../../store/images'
import ProductImage from '../../components/store/ProductImage'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary, btnDanger } from './ui'

const vazio = () => ({
  id: '',
  nome: '',
  categoria: '',
  preco: '',
  precoPromo: '',
  descricao: '',
  tamanhosStr: '',
  coresStr: '',
  estoque: 0,
  destaque: false,
  ativo: true,
  imagens: [],
})

// Sem `loja`: painel da APHAM (todos os produtos, com filtro por loja).
// Com `loja`: área do lojista (só os produtos dele, preço = valor que ele recebe).
export default function ProductsAdmin({ loja = null }) {
  const { produtos: todos, categorias, saveProduto, deleteProduto, lojas, comissao } = useStore()
  const [filtroLoja, setFiltroLoja] = useState('todas')
  const nomeLoja = (id) => lojas.find((l) => l.id === id)?.nome || 'Loja parceira'
  const produtos = loja
    ? todos.filter((p) => p.lojaId === loja.id)
    : todos.filter((p) => filtroLoja === 'todas' || (filtroLoja === 'apham' ? !p.lojaId : p.lojaId === filtroLoja))
  const [form, setForm] = useState(null) // objeto em edição ou null
  const [enviando, setEnviando] = useState(false)

  const abrirNovo = () => setForm(vazio())
  const abrirEdicao = (p) =>
    setForm({
      ...p,
      precoPromo: p.precoPromo ?? '',
      tamanhosStr: (p.tamanhos || []).join(', '),
      coresStr: (p.cores || []).join(', '),
    })

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const addImagens = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setEnviando(true)
    try {
      const urls = []
      for (const f of files) urls.push(await fileToOptimizedDataURL(f))
      setForm((f) => ({ ...f, imagens: [...(f.imagens || []), ...urls] }))
    } catch {
      alert('Não consegui processar uma das imagens. Tente outra.')
    } finally {
      setEnviando(false)
    }
  }
  const removerImagem = (i) => setForm((f) => ({ ...f, imagens: f.imagens.filter((_, idx) => idx !== i) }))

  const salvar = async (e) => {
    e.preventDefault()
    const id = form.id || `${slugify(form.nome) || 'produto'}-${novoId().slice(-4)}`
    const produto = {
      id,
      nome: form.nome.trim(),
      categoria: form.categoria || (categorias[0]?.id ?? ''),
      preco: Number(form.preco) || 0,
      precoPromo: form.precoPromo === '' || form.precoPromo == null ? null : Number(form.precoPromo),
      descricao: form.descricao.trim(),
      tamanhos: form.tamanhosStr.split(',').map((s) => s.trim()).filter(Boolean),
      cores: form.coresStr.split(',').map((s) => s.trim()).filter(Boolean),
      estoque: Number(form.estoque) || 0,
      destaque: !!form.destaque,
      ativo: !!form.ativo,
      imagens: form.imagens || [],
      ...(loja ? { lojaId: loja.id } : form.lojaId ? { lojaId: form.lojaId } : {}),
    }
    const ok = await saveProduto(produto)
    if (ok === false) return alert('Não foi possível salvar o produto. Verifique a conexão e tente de novo.')
    setForm(null)
  }

  const excluir = (p) => {
    if (window.confirm(`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`)) deleteProduto(p.id)
  }

  const nomeCategoria = (id) => categorias.find((c) => c.id === id)?.nome || '—'

  return (
    <div>
      <PageTitle title={loja ? 'Meus produtos' : 'Produtos'} subtitle={`${produtos.length} produtos cadastrados`}>
        <div className="flex flex-wrap items-center gap-2">
          {!loja && lojas.length > 0 && (
            <select value={filtroLoja} onChange={(e) => setFiltroLoja(e.target.value)} className={`${inputCls} w-auto py-2`}>
              <option value="todas">Todas as lojas</option>
              <option value="apham">Só da APHAM</option>
              {lojas.map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          )}
          <button type="button" onClick={abrirNovo} className={btnAccent}>
            <Plus className="h-4 w-4" />
            Novo produto
          </button>
        </div>
      </PageTitle>
      {loja && (
        <Card className="mb-4 border-cyan-200 bg-cyan-50 text-sm text-cyan-900">
          Cadastre o preço que <strong>você quer receber</strong>. Na loja, o produto aparece com esse valor + {comissao}% da APHAM.
        </Card>
      )}

      {produtos.length === 0 ? (
        <Card className="text-sm text-navy-500">Nenhum produto. Clique em "Novo produto".</Card>
      ) : (
        <div className="space-y-3">
          {produtos.map((p) => (
            <Card key={p.id} className="flex items-center gap-4 p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <ProductImage produto={p} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-display text-sm font-bold text-navy-900">{p.nome}</h3>
                  {p.destaque && <Star className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />}
                  {!loja && p.lojaId && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">{nomeLoja(p.lojaId)}</span>}
                </div>
                <p className="text-xs text-navy-500">
                  {nomeCategoria(p.categoria)} · Estoque: {p.estoque} ·{' '}
                  {p.ativo === false ? <span className="text-red-500">inativo</span> : 'ativo'}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-display text-sm font-bold text-navy-900">{formatBRL(precoFinal(p))}</p>
                {p.precoPromo != null && p.precoPromo !== '' && (
                  <p className="text-xs text-navy-400 line-through">{formatBRL(p.preco)}</p>
                )}
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => abrirEdicao(p)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => excluir(p)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Formulário (modal) */}
      {form && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="my-8 w-full max-w-2xl rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">
                {form.id ? 'Editar produto' : 'Novo produto'}
              </h2>
              <button type="button" onClick={() => setForm(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Nome *">
                  <input required value={form.nome} onChange={(e) => set('nome', e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Categoria">
                <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className={inputCls}>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </Field>
              <Field label="Estoque">
                <input type="number" min="0" value={form.estoque} onChange={(e) => set('estoque', e.target.value)} className={inputCls} />
              </Field>
              <Field
                label={loja || form.lojaId ? 'Preço do lojista (R$) *' : 'Preço (R$) *'}
                hint={(loja || form.lojaId) && Number(form.preco) > 0 ? `Na loja: ${formatBRL(Number(form.preco) * (1 + comissao / 100))} (com ${comissao}% da APHAM)` : undefined}
              >
                <input type="number" step="0.01" min="0" required value={form.preco} onChange={(e) => set('preco', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Preço promocional (opcional)">
                <input type="number" step="0.01" min="0" value={form.precoPromo} onChange={(e) => set('precoPromo', e.target.value)} className={inputCls} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descrição">
                  <textarea rows={3} value={form.descricao} onChange={(e) => set('descricao', e.target.value)} className={`${inputCls} resize-none`} />
                </Field>
              </div>
              <Field label="Tamanhos" hint="Separe por vírgula. Ex.: PP, P, M, G, GG">
                <input value={form.tamanhosStr} onChange={(e) => set('tamanhosStr', e.target.value)} className={inputCls} placeholder="PP, P, M, G, GG" />
              </Field>
              <Field label="Cores" hint="Separe por vírgula. Ex.: Azul, Branco">
                <input value={form.coresStr} onChange={(e) => set('coresStr', e.target.value)} className={inputCls} placeholder="Azul, Branco" />
              </Field>

              {/* Imagens */}
              <div className="sm:col-span-2">
                <Field label="Imagens" hint="As imagens são otimizadas automaticamente.">
                  <div className="flex flex-wrap gap-3">
                    {form.imagens?.map((im, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-navy-200">
                        <img src={im} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removerImagem(i)} className="absolute right-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-950/70 text-white" aria-label="Remover imagem">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600">
                      {enviando ? <ImageIcon className="h-5 w-5 animate-pulse" /> : <Upload className="h-5 w-5" />}
                      <span className="text-[10px] font-medium">{enviando ? '...' : 'Adicionar'}</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImagens(e.target.files)} />
                    </label>
                  </div>
                </Field>
              </div>

              {!loja && (
                <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
                  <input type="checkbox" checked={form.destaque} onChange={(e) => set('destaque', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
                  Produto em destaque
                </label>
              )}
              <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
                <input type="checkbox" checked={form.ativo} onChange={(e) => set('ativo', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
                Ativo (visível na loja)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar produto</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
