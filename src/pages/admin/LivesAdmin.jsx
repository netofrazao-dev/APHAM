import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Radio, StopCircle, ChevronUp, ChevronDown, FolderPlus, Tag } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { youtubeId } from '../../lib/youtube'
import { categoriasLives, livesPorCategoria } from '../../lib/lives'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary, btnDanger } from './ui'

export default function LivesAdmin() {
  const { lives, saveLive, deleteLive, settings, updateSettings } = useStore()
  const [jogo, setJogo] = useState(null)
  const [novaCat, setNovaCat] = useState('')
  const categorias = categoriasLives(settings, lives)
  const grupos = livesPorCategoria(settings, lives)
  const NOVA = '__nova__'

  // ----- Categorias -----
  const salvarCategorias = (lista) => updateSettings({ livesCategorias: lista })
  const adicionarCategoria = (nome) => {
    const n = nome.trim()
    if (!n) return
    if (categorias.some((c) => c.toLowerCase() === n.toLowerCase())) return alert('Essa categoria já existe.')
    salvarCategorias([...categorias, n])
    setNovaCat('')
  }
  const moverCategoria = (i, d) => {
    const j = i + d
    if (j < 0 || j >= categorias.length) return
    const l = [...categorias]
    ;[l[i], l[j]] = [l[j], l[i]]
    salvarCategorias(l)
  }
  const renomearCategoria = (antigo) => {
    const novo = (window.prompt('Novo nome da categoria:', antigo) || '').trim()
    if (!novo || novo === antigo) return
    if (categorias.some((c) => c !== antigo && c.toLowerCase() === novo.toLowerCase())) return alert('Já existe uma categoria com esse nome.')
    salvarCategorias(categorias.map((c) => (c === antigo ? novo : c)))
    lives.filter((j) => j.torneio === antigo).forEach((j) => saveLive({ ...j, torneio: novo }))
  }
  const removerCategoria = (nome) => {
    const qtd = lives.filter((j) => j.torneio === nome).length
    const msg = qtd
      ? `Remover a categoria “${nome}”? Os ${qtd} jogo(s) dela continuam no site, em “Outros jogos”, até você escolher outra categoria.`
      : `Remover a categoria “${nome}”?`
    if (!window.confirm(msg)) return
    salvarCategorias(categorias.filter((c) => c !== nome))
    lives.filter((j) => j.torneio === nome).forEach((j) => saveLive({ ...j, torneio: '' }))
  }

  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const idAoVivo = aoVivo ? youtubeId(settings.aoVivoUrl) : null

  const salvar = (e) => {
    e.preventDefault()
    const id = youtubeId(jogo.link || jogo.id || '')
    if (!id) {
      alert('Cole um link válido de um vídeo do YouTube.')
      return
    }
    const categoria = jogo.torneio === NOVA ? (jogo.novaCategoria || '').trim() : (jogo.torneio || '').trim()
    if (jogo.torneio === NOVA && !categoria) {
      alert('Digite o nome da nova categoria.')
      return
    }
    if (categoria && !categorias.includes(categoria)) salvarCategorias([...categorias, categoria])
    // Se trocou o vídeo de um jogo existente, remove o registro antigo.
    if (jogo.id && jogo.id !== id) deleteLive(jogo.id)
    saveLive({ id, torneio: categoria, titulo: (jogo.titulo || '').trim() })
    setJogo(null)
  }

  const marcarAoVivo = (j) =>
    updateSettings({
      aoVivoAtivo: true,
      aoVivoUrl: `https://www.youtube.com/watch?v=${j.id}`,
      aoVivoTitulo: j.titulo,
    })
  const encerrar = () => updateSettings({ aoVivoAtivo: false })

  return (
    <div>
      <PageTitle title="Lives APHAM" subtitle="Jogos transmitidos no YouTube, organizados por categoria, e o que está ao vivo">
        <button
          type="button"
          onClick={() => setJogo({ torneio: categorias[0] || '', titulo: '', link: '' })}
          className={btnAccent}
        >
          <Plus className="h-4 w-4" />
          Novo jogo
        </button>
      </PageTitle>

      {/* Estado do ao vivo */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${aoVivo ? 'bg-red-100 text-red-600' : 'bg-navy-100 text-navy-400'}`}>
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-navy-900">
                {aoVivo ? 'Transmissão ao vivo ativa' : 'Nenhuma transmissão ao vivo'}
              </p>
              <p className="text-xs text-navy-500">
                {aoVivo ? settings.aoVivoTitulo || 'APHAM ao vivo' : 'Use "Marcar ao vivo" num jogo abaixo para destacá-lo no site.'}
              </p>
            </div>
          </div>
          {aoVivo && (
            <button type="button" onClick={encerrar} className={btnDanger}>
              <StopCircle className="h-4 w-4" />
              Encerrar ao vivo
            </button>
          )}
        </div>
      </Card>

      {/* Categorias */}
      <Card className="mb-6">
        <h2 className="flex items-center gap-2 font-display font-bold text-navy-900">
          <Tag className="h-5 w-5 text-cyan-600" />
          Categorias
        </h2>
        <p className="mt-0.5 text-sm text-navy-500">
          Ex.: TFA, Copa Handebol, Jogos Escolares. No site, os jogos aparecem separados por categoria, nesta ordem, com um filtro para escolher.
        </p>
        <ul className="mt-4 divide-y divide-navy-100 rounded-xl border border-navy-100">
          {categorias.map((c, i) => {
            const qtd = lives.filter((j) => j.torneio === c).length
            return (
              <li key={c} className="flex items-center gap-2 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-900">{c}</span>
                <span className="shrink-0 text-xs text-navy-400">{qtd} jogo(s)</span>
                <button type="button" onClick={() => moverCategoria(i, -1)} disabled={i === 0} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Subir">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => moverCategoria(i, 1)} disabled={i === categorias.length - 1} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Descer">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => renomearCategoria(c)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Renomear">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => removerCategoria(c)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Remover categoria">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            )
          })}
          {categorias.length === 0 && <li className="px-3 py-3 text-sm text-navy-500">Nenhuma categoria ainda.</li>}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            adicionarCategoria(novaCat)
          }}
          className="mt-3 flex gap-2"
        >
          <input value={novaCat} onChange={(e) => setNovaCat(e.target.value)} placeholder="Nome da nova categoria" className={inputCls} />
          <button type="submit" className={btnAccent}>
            <FolderPlus className="h-4 w-4" />
            Criar
          </button>
        </form>
      </Card>

      {/* Lista de jogos, por categoria */}
      {grupos.map((g) => (
        <div key={g.nome} className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-navy-900">
              {g.nome} <span className="text-navy-400">· {g.jogos.length}</span>
            </h2>
            {g.nome !== 'Outros jogos' && (
              <button type="button" onClick={() => setJogo({ torneio: g.nome, titulo: '', link: '' })} className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:underline">
                <Plus className="h-4 w-4" />
                Jogo nesta categoria
              </button>
            )}
          </div>
      <div className="space-y-3">
        {g.jogos.map((j) => {
          const vivo = idAoVivo && idAoVivo === j.id
          return (
            <Card key={j.id} className="flex items-center gap-4 p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                <img src={`https://i.ytimg.com/vi/${j.id}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-sm font-bold text-navy-900">{j.titulo}</h3>
                {vivo && <span className="text-xs font-bold uppercase text-red-600">● ao vivo agora</span>}
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                {vivo ? (
                  <button type="button" onClick={encerrar} className={btnDanger}>
                    <StopCircle className="h-4 w-4" />
                    Encerrar
                  </button>
                ) : (
                  <button type="button" onClick={() => marcarAoVivo(j)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                    <Radio className="h-4 w-4" />
                    Marcar ao vivo
                  </button>
                )}
                <button type="button" onClick={() => setJogo({ ...j, link: `https://www.youtube.com/watch?v=${j.id}` })} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => window.confirm('Remover este jogo?') && deleteLive(j.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
        </div>
      ))}
      {lives.length === 0 && <Card className="text-sm text-navy-500">Nenhum jogo cadastrado.</Card>}

      {/* Modal do jogo */}
      {jogo && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="my-8 w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{jogo.id ? 'Editar jogo' : 'Novo jogo'}</h2>
              <button type="button" onClick={() => setJogo(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Link do vídeo no YouTube *" hint="Cole o link do jogo (ex.: https://www.youtube.com/watch?v=...).">
                <input required value={jogo.link} onChange={(e) => setJogo((p) => ({ ...p, link: e.target.value }))} className={inputCls} placeholder="https://www.youtube.com/watch?v=..." />
              </Field>
              <Field label="Categoria" hint="Em qual grupo o jogo aparece no site.">
                <select value={jogo.torneio} onChange={(e) => setJogo((p) => ({ ...p, torneio: e.target.value }))} className={inputCls}>
                  <option value="">— Sem categoria (Outros jogos) —</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value={NOVA}>＋ Criar nova categoria…</option>
                </select>
              </Field>
              {jogo.torneio === NOVA && (
                <Field label="Nome da nova categoria">
                  <input autoFocus value={jogo.novaCategoria || ''} onChange={(e) => setJogo((p) => ({ ...p, novaCategoria: e.target.value }))} className={inputCls} placeholder="Ex.: Jogos Escolares 2026" />
                </Field>
              )}
              <Field label="Título / jogo *">
                <input required value={jogo.titulo} onChange={(e) => setJogo((p) => ({ ...p, titulo: e.target.value }))} className={inputCls} placeholder="Final — Bulls x Canibal" />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setJogo(null)} className={btnGhost}>Cancelar</button>
              <button type="submit" className={btnPrimary}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
