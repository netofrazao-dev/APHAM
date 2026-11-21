import { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, X, Loader2 } from 'lucide-react'
import { fileToOptimizedDataURL } from '../../store/images'
import { inputCls } from './ui'

// Peças reaproveitadas pelas telas de conteúdo do painel (Participar, Eventos,
// Quem somos…): lista de itens com campos, botões de subir/descer/remover e
// envio de foto.

export function EnviarFoto({ value, onChange, rotulo = 'Foto', largura = 1200, className = 'h-28 w-44' }) {
  const [carregando, setCarregando] = useState(false)
  const enviar = async (file) => {
    if (!file) return
    setCarregando(true)
    try {
      onChange(await fileToOptimizedDataURL(file, largura, 0.8))
    } catch {
      window.alert('Não consegui abrir essa imagem. Tente outra (JPG ou PNG).')
    } finally {
      setCarregando(false)
    }
  }
  return value ? (
    <div className={`relative overflow-hidden rounded-xl border border-navy-200 bg-navy-50 ${className}`}>
      <img src={value} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-navy-950/60 p-1">
        <label className="cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-white/20">
          Trocar
          <input type="file" accept="image/*" className="hidden" onChange={(e) => enviar(e.target.files?.[0])} />
        </label>
        <button type="button" onClick={() => onChange('')} className="rounded-md p-0.5 text-white hover:bg-white/20" aria-label="Remover foto">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  ) : (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600 ${className}`}>
      {carregando ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
      <span className="text-xs font-medium">{carregando ? 'Carregando…' : rotulo}</span>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => enviar(e.target.files?.[0])} />
    </label>
  )
}

// campos: [{ k, rotulo, tipo: 'texto'|'area'|'foto'|'select', opcoes?, dica?, col? (classes do grid), linhas? }]
function Campo({ c, valor, mudar }) {
  if (c.tipo === 'foto') return <EnviarFoto value={valor} onChange={mudar} rotulo={c.rotulo} />
  if (c.tipo === 'area')
    return <textarea rows={c.linhas || 3} value={valor ?? ''} onChange={(e) => mudar(e.target.value)} placeholder={c.dica} className={`${inputCls} resize-y`} />
  if (c.tipo === 'select')
    return (
      <select value={valor ?? ''} onChange={(e) => mudar(e.target.value)} className={inputCls}>
        {c.opcoes.map(([v, nome]) => (
          <option key={v} value={v}>
            {nome}
          </option>
        ))}
      </select>
    )
  return <input value={valor ?? ''} onChange={(e) => mudar(e.target.value)} placeholder={c.dica} className={inputCls} />
}

export function ListaEditavel({ itens, onChange, campos, novo, rotuloNovo = 'Adicionar', titulo, vazio = 'Nada aqui ainda.' }) {
  const mudar = (i, k, v) => onChange(itens.map((it, n) => (n === i ? { ...it, [k]: v } : it)))
  const mover = (i, d) => {
    const j = i + d
    if (j < 0 || j >= itens.length) return
    const l = [...itens]
    ;[l[i], l[j]] = [l[j], l[i]]
    onChange(l)
  }
  const remover = (i) => {
    if (window.confirm('Remover este item?')) onChange(itens.filter((_, n) => n !== i))
  }
  return (
    <div className="space-y-3">
      {itens.length === 0 && <p className="rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-500">{vazio}</p>}
      {itens.map((it, i) => (
        <div key={i} className="rounded-xl border border-navy-100 bg-paper p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-navy-400">
              {titulo ? titulo(it, i) : `Item ${i + 1}`}
            </span>
            <div className="ml-auto flex gap-1">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Subir">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => mover(i, 1)} disabled={i === itens.length - 1} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 hover:bg-navy-50 disabled:opacity-30" aria-label="Descer">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => remover(i)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50" aria-label="Remover">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            {campos.map((c) => {
              // Foto já tem o próprio <label> (botão de enviar): não aninhar.
              const Tag = c.tipo === 'foto' ? 'div' : 'label'
              return (
                <Tag key={c.k} className={`block ${c.col || 'sm:col-span-6'}`}>
                  <span className="mb-1 block text-xs font-semibold text-navy-700">{c.rotulo}</span>
                  <Campo c={c} valor={it[c.k]} mudar={(v) => mudar(i, c.k, v)} />
                </Tag>
              )
            })}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...itens, typeof novo === 'function' ? novo() : { ...novo }])} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50">
        <Plus className="h-4 w-4" />
        {rotuloNovo}
      </button>
    </div>
  )
}

// Lista simples de frases (uma por linha), editada como lista.
export function ListaTextos({ itens, onChange, rotuloNovo = 'Adicionar linha', dica }) {
  return (
    <div className="space-y-2">
      {itens.map((t, i) => (
        <div key={i} className="flex gap-2">
          <input value={t} onChange={(e) => onChange(itens.map((x, n) => (n === i ? e.target.value : x)))} placeholder={dica} className={inputCls} />
          <button type="button" onClick={() => onChange(itens.filter((_, n) => n !== i))} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50" aria-label="Remover">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...itens, ''])} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50">
        <Plus className="h-4 w-4" />
        {rotuloNovo}
      </button>
    </div>
  )
}

// Barra de salvar fixa no rodapé da tela, que aparece quando há mudanças.
export function BarraSalvar({ alterado, onSalvar, onDescartar, salvo }) {
  if (!alterado && !salvo) return null
  return (
    <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white/95 px-4 py-3 shadow-lift backdrop-blur">
      <span className={`text-sm font-semibold ${salvo && !alterado ? 'text-emerald-600' : 'text-amber-700'}`}>
        {salvo && !alterado ? '✓ Salvo! Já está no site.' : 'Você tem mudanças que ainda não foram salvas.'}
      </span>
      {alterado && (
        <div className="flex gap-2">
          <button type="button" onClick={onDescartar} className="rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50">
            Desfazer
          </button>
          <button type="button" onClick={onSalvar} className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-600">
            Salvar no site
          </button>
        </div>
      )}
    </div>
  )
}

// Rascunho de uma tela de edição: guarda as mudanças até clicar em "Salvar".
export function useRascunho(inicial, salvarFn) {
  const [base, setBase] = useState(inicial)
  const [form, setForm] = useState(inicial)
  const [salvo, setSalvo] = useState(false)
  const alterado = JSON.stringify(form) !== JSON.stringify(base)
  const salvar = () => {
    salvarFn(form)
    setBase(form)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }
  return { form, setForm, alterado, salvar, descartar: () => setForm(base), salvo }
}
