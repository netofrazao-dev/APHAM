import { useState } from 'react'
import { ChevronUp, ChevronDown, Trash2, Type, Heading2, Image as ImageIcon, Images, Youtube, Quote, MousePointerClick, Upload, X } from 'lucide-react'
import { fileToOptimizedDataURL } from '../../store/images'
import { Field, inputCls } from './ui'

// Montador da página da notícia: blocos extras que aparecem depois do texto
// principal, na ordem da lista.
export const TIPOS_BLOCO = [
  { tipo: 'subtitulo', nome: 'Subtítulo', Icone: Heading2, novo: { texto: '' } },
  { tipo: 'texto', nome: 'Texto', Icone: Type, novo: { texto: '' } },
  { tipo: 'imagem', nome: 'Imagem', Icone: ImageIcon, novo: { img: '', legenda: '' } },
  { tipo: 'galeria', nome: 'Galeria de fotos', Icone: Images, novo: { titulo: '', imgs: [] } },
  { tipo: 'video', nome: 'Vídeo do YouTube', Icone: Youtube, novo: { url: '', legenda: '' } },
  { tipo: 'citacao', nome: 'Citação', Icone: Quote, novo: { texto: '', autor: '' } },
  { tipo: 'botao', nome: 'Botão', Icone: MousePointerClick, novo: { rotulo: '', url: '' } },
]

// Tira blocos vazios antes de salvar.
export function limparBlocos(blocos) {
  return (blocos || []).filter((b) => {
    if (b.tipo === 'subtitulo' || b.tipo === 'texto' || b.tipo === 'citacao') return b.texto?.trim()
    if (b.tipo === 'imagem') return b.img
    if (b.tipo === 'galeria') return b.imgs?.length
    if (b.tipo === 'video') return b.url?.trim()
    if (b.tipo === 'botao') return b.rotulo?.trim() && b.url?.trim()
    return false
  })
}

function SobeFotos({ multiplo, onFotos, rotulo }) {
  const [carregando, setCarregando] = useState(false)
  const handle = async (files) => {
    if (!files?.length) return
    setCarregando(true)
    try {
      const out = []
      for (const f of files) out.push(await fileToOptimizedDataURL(f, 1400, 0.8))
      onFotos(out)
    } catch {
      alert('Não consegui processar a imagem.')
    } finally {
      setCarregando(false)
    }
  }
  return (
    <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600">
      <Upload className="h-5 w-5" />
      <span className="text-center text-[10px] font-medium leading-tight">{carregando ? '...' : rotulo}</span>
      <input type="file" accept="image/*" multiple={multiplo} className="hidden" onChange={(e) => handle([...(e.target.files || [])])} />
    </label>
  )
}

function Miniatura({ src, onRemover }) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-navy-200">
      <img src={src} alt="" className="h-full w-full object-cover" />
      <button type="button" onClick={onRemover} className="absolute right-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-950/70 text-white" aria-label="Remover">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function CamposBloco({ b, set }) {
  if (b.tipo === 'subtitulo') return <input value={b.texto} onChange={(e) => set({ texto: e.target.value })} className={inputCls} placeholder="Ex.: Como foi o campeonato" />
  if (b.tipo === 'texto')
    return <textarea rows={5} value={b.texto} onChange={(e) => set({ texto: e.target.value })} className={`${inputCls} resize-y`} placeholder="Pule uma linha para separar parágrafos." />
  if (b.tipo === 'imagem')
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {b.img ? <Miniatura src={b.img} onRemover={() => set({ img: '' })} /> : <SobeFotos rotulo="Imagem" onFotos={([f]) => set({ img: f })} />}
        </div>
        <input value={b.legenda} onChange={(e) => set({ legenda: e.target.value })} className={inputCls} placeholder="Legenda (opcional)" />
      </div>
    )
  if (b.tipo === 'galeria')
    return (
      <div className="space-y-2">
        <input value={b.titulo} onChange={(e) => set({ titulo: e.target.value })} className={inputCls} placeholder="Título da galeria (opcional)" />
        <div className="flex flex-wrap gap-2">
          {b.imgs.map((src, i) => (
            <Miniatura key={i} src={src} onRemover={() => set({ imgs: b.imgs.filter((_, j) => j !== i) })} />
          ))}
          <SobeFotos multiplo rotulo="Adicionar fotos" onFotos={(fs) => set({ imgs: [...b.imgs, ...fs] })} />
        </div>
      </div>
    )
  if (b.tipo === 'video')
    return (
      <div className="space-y-2">
        <input value={b.url} onChange={(e) => set({ url: e.target.value })} className={inputCls} placeholder="Link do YouTube (ex.: https://youtu.be/...)" />
        <input value={b.legenda} onChange={(e) => set({ legenda: e.target.value })} className={inputCls} placeholder="Legenda (opcional)" />
      </div>
    )
  if (b.tipo === 'citacao')
    return (
      <div className="space-y-2">
        <textarea rows={2} value={b.texto} onChange={(e) => set({ texto: e.target.value })} className={`${inputCls} resize-y`} placeholder="Frase em destaque" />
        <input value={b.autor} onChange={(e) => set({ autor: e.target.value })} className={inputCls} placeholder="Quem disse (opcional)" />
      </div>
    )
  if (b.tipo === 'botao')
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input value={b.rotulo} onChange={(e) => set({ rotulo: e.target.value })} className={inputCls} placeholder="Texto do botão" />
        <input value={b.url} onChange={(e) => set({ url: e.target.value })} className={inputCls} placeholder="Link (https://... ou /pagina)" />
      </div>
    )
  return null
}

export default function EditorBlocos({ blocos, onChange }) {
  const set = (i, patch) => onChange(blocos.map((b, j) => (j === i ? { ...b, ...patch } : b)))
  const mover = (i, d) => {
    const n = [...blocos]
    ;[n[i], n[i + d]] = [n[i + d], n[i]]
    onChange(n)
  }
  return (
    <Field label="Conteúdo extra da página" hint="Monte a página da notícia: os blocos aparecem depois do texto principal, nesta ordem.">
      <div className="space-y-3">
        {blocos.map((b, i) => {
          const def = TIPOS_BLOCO.find((t) => t.tipo === b.tipo)
          if (!def) return null
          return (
            <div key={i} className="rounded-xl border border-navy-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-600">
                  <def.Icone className="h-4 w-4 text-cyan-600" />
                  {def.nome}
                </span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Subir"><ChevronUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === blocos.length - 1} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Descer"><ChevronDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onChange(blocos.filter((_, j) => j !== i))} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50" aria-label="Remover bloco"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <CamposBloco b={b} set={(patch) => set(i, patch)} />
            </div>
          )
        })}
        <div className="flex flex-wrap gap-2">
          {TIPOS_BLOCO.map((t) => (
            <button
              key={t.tipo}
              type="button"
              onClick={() => onChange([...blocos, { tipo: t.tipo, ...structuredClone(t.novo) }])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-navy-300 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800"
            >
              <t.Icone className="h-3.5 w-3.5" />+ {t.nome}
            </button>
          ))}
        </div>
      </div>
    </Field>
  )
}
