import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown, Square, SquareStack } from 'lucide-react'
import { useStore, novoId } from '../../store/StoreContext'
import { fileToOptimizedDataURL } from '../../store/images'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

function Upload1({ value, onChange }) {
  const [carregando, setCarregando] = useState(false)
  const handle = async (file) => {
    if (!file) return
    setCarregando(true)
    try {
      onChange(await fileToOptimizedDataURL(file))
    } catch {
      alert('Não consegui processar a imagem.')
    } finally {
      setCarregando(false)
    }
  }
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-navy-200">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute right-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-950/70 text-white" aria-label="Remover">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600">
          <Upload className="h-5 w-5" />
          <span className="text-[10px] font-medium">{carregando ? '...' : 'Imagem'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
        </label>
      )}
    </div>
  )
}

export default function NewsAdmin() {
  const { novidades, stories, saveNovidade, deleteNovidade, moveNovidade, setSombraTodos, saveStory, deleteStory } = useStore()
  const [post, setPost] = useState(null)
  const [story, setStory] = useState(null)

  // Lista de posts na ordem que aparece no site (campo `ordem`).
  const posts = [...novidades].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

  const salvarPost = (e) => {
    e.preventDefault()
    const foto1 = post.img || ''
    const foto2 = post.img2 || ''
    saveNovidade({
      id: post.id || novoId('nov'),
      // Mantém a ordem ao editar; novo post vai para o fim da lista.
      ordem: post.ordem ?? novidades.length,
      // Mantém o estado da sombra do card (ligada por padrão).
      sombra: post.sombra,
      data: post.data || '',
      tag: post.tag || '',
      titulo: post.titulo || '',
      texto: post.texto || '',
      img: foto1,
      // Efeito de 2 fotos: se houver segunda foto, guarda as duas em `imgs`.
      imgs: foto2 ? [foto1, foto2].filter(Boolean) : undefined,
    })
    setPost(null)
  }
  const salvarStory = (e) => {
    e.preventDefault()
    saveStory({ id: story.id || novoId('story'), titulo: story.titulo || '', img: story.img || '' })
    setStory(null)
  }

  return (
    <div>
      <PageTitle title="Novidades" subtitle="Publique posts e stories que aparecem no site" />

      {/* Stories */}
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-900">Stories</h2>
          <button type="button" onClick={() => setStory({ titulo: '', img: '' })} className={btnAccent}>
            <Plus className="h-4 w-4" />
            Novo story
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {stories.map((s) => (
            <div key={s.id} className="group relative flex flex-col items-center gap-1.5">
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-cyan-400 p-0.5">
                {s.img ? <img src={s.img} alt={s.titulo} className="h-full w-full rounded-full object-cover" /> : <div className="h-full w-full rounded-full bg-navy-100" />}
              </div>
              <span className="max-w-[80px] truncate text-xs text-navy-600">{s.titulo}</span>
              <div className="absolute -right-1 -top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => setStory(s)} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 text-white" aria-label="Editar"><Pencil className="h-3 w-3" /></button>
                <button type="button" onClick={() => window.confirm('Excluir este story?') && deleteStory(s.id)} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white" aria-label="Excluir"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
          {stories.length === 0 && <p className="text-sm text-navy-500">Nenhum story.</p>}
        </div>
      </div>

      {/* Posts */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">Posts</h2>
          <p className="text-xs text-navy-500">Use as setas ↑ ↓ para a ordem. O botão de sombra liga/desliga o sombreado de cada card.</p>
        </div>
        <button type="button" onClick={() => setPost({ data: '', tag: '', titulo: '', texto: '', img: '', img2: '' })} className={btnAccent}>
          <Plus className="h-4 w-4" />
          Novo post
        </button>
      </div>

      {/* Sombra dos cards — todos de uma vez */}
      {posts.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/60 px-3 py-2">
          <span className="text-sm font-semibold text-navy-700">Sombra dos cards:</span>
          <button type="button" onClick={() => setSombraTodos(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700 shadow-soft hover:bg-navy-50">
            <SquareStack className="h-4 w-4" />
            Ligar em todos
          </button>
          <button type="button" onClick={() => setSombraTodos(false)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700 hover:bg-navy-50">
            <Square className="h-4 w-4" />
            Tirar de todos
          </button>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((n, i) => (
          <Card key={n.id} className="flex items-center gap-3 p-3">
            <div className="flex flex-col">
              <button type="button" onClick={() => moveNovidade(n.id, -1)} disabled={i === 0} className="inline-flex h-6 w-7 items-center justify-center rounded-t-md border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Mover para cima"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => moveNovidade(n.id, 1)} disabled={i === posts.length - 1} className="-mt-px inline-flex h-6 w-7 items-center justify-center rounded-b-md border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Mover para baixo"><ChevronDown className="h-4 w-4" /></button>
            </div>
            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-100">
              {n.img && <img src={n.img} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-cyan-600">{n.tag} · {n.data}</p>
              <h3 className="truncate font-display text-sm font-bold text-navy-900">{n.titulo}</h3>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => saveNovidade({ ...n, sombra: n.sombra === false })}
                title={n.sombra === false ? 'Sem sombra (clique para ligar)' : 'Com sombra (clique para tirar)'}
                aria-label="Ligar/desligar sombra"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                  n.sombra === false ? 'border-navy-200 text-navy-400' : 'border-navy-300 bg-white text-navy-800 shadow-md'
                } hover:bg-navy-50`}
              >
                <SquareStack className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setPost({ ...n, img2: n.imgs?.[1] || '' })} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => window.confirm('Excluir este post?') && deleteNovidade(n.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
        {novidades.length === 0 && <Card className="text-sm text-navy-500">Nenhum post.</Card>}
      </div>

      {/* Modal post */}
      {post && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvarPost} className="my-8 w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{post.id ? 'Editar post' : 'Novo post'}</h2>
              <button type="button" onClick={() => setPost(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data"><input value={post.data} onChange={(e) => setPost((p) => ({ ...p, data: e.target.value }))} className={inputCls} placeholder="2024" /></Field>
                <Field label="Etiqueta"><input value={post.tag} onChange={(e) => setPost((p) => ({ ...p, tag: e.target.value }))} className={inputCls} placeholder="Conquista" /></Field>
              </div>
              <Field label="Título *"><input required value={post.titulo} onChange={(e) => setPost((p) => ({ ...p, titulo: e.target.value }))} className={inputCls} /></Field>
              <Field label="Matéria (texto completo)" hint="Aparece inteira no 'Saiba mais'. No card, mostramos as primeiras linhas. Pule uma linha para separar parágrafos.">
                <textarea rows={8} value={post.texto} onChange={(e) => setPost((p) => ({ ...p, texto: e.target.value }))} className={`${inputCls} resize-y`} placeholder="Escreva a matéria completa aqui..." />
              </Field>
              <Field label="Imagem"><Upload1 value={post.img} onChange={(v) => setPost((p) => ({ ...p, img: v }))} /></Field>
              <Field label="Segunda foto (opcional — efeito de 2 fotos)">
                <Upload1 value={post.img2} onChange={(v) => setPost((p) => ({ ...p, img2: v }))} />
                <p className="mt-1.5 text-xs text-navy-500">
                  Se você colocar uma segunda foto, o card alterna entre as duas com um efeito de
                  transição. Deixe em branco para usar só uma foto.
                </p>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPost(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal story */}
      {story && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvarStory} className="w-full max-w-md rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{story.id ? 'Editar story' : 'Novo story'}</h2>
              <button type="button" onClick={() => setStory(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Título *"><input required value={story.titulo} onChange={(e) => setStory((s) => ({ ...s, titulo: e.target.value }))} className={inputCls} /></Field>
              <Field label="Imagem"><Upload1 value={story.img} onChange={(v) => setStory((s) => ({ ...s, img: v }))} /></Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setStory(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
