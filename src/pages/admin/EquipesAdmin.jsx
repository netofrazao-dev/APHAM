import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Upload, Trophy } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { clubes as clubesSeed } from '../../data/content'
import { fileToOptimizedDataURL } from '../../store/images'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary } from './ui'

function UploadEscudo({ value, onChange }) {
  const [carregando, setCarregando] = useState(false)
  const handle = async (file) => {
    if (!file) return
    setCarregando(true)
    try {
      onChange(await fileToOptimizedDataURL(file, 500, 0.85))
    } catch {
      alert('Não consegui processar a imagem.')
    } finally {
      setCarregando(false)
    }
  }
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-navy-200 bg-navy-900">
          <img src={value} alt="" className="h-full w-full object-contain p-1" />
          <button type="button" onClick={() => onChange('')} className="absolute right-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-950/70 text-white" aria-label="Remover"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600">
          <Upload className="h-5 w-5" />
          <span className="text-[10px] font-medium">{carregando ? '...' : 'Escudo'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
        </label>
      )}
    </div>
  )
}

export default function EquipesAdmin() {
  const { settings, updateSettings } = useStore()
  const [times, setTimes] = useState(() => settings?.clubes ?? clubesSeed)
  const [time, setTime] = useState(null) // { idx, nome, escudo, historia, titulosTexto }
  const [salvo, setSalvo] = useState(false)

  const persistir = (lista) => {
    setTimes(lista)
    updateSettings({ clubes: lista })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 1600)
  }

  const salvarTime = (e) => {
    e.preventDefault()
    if (!time.nome?.trim()) {
      alert('Dê um nome ao time.')
      return
    }
    const t = {
      nome: time.nome.trim(),
      escudo: time.escudo || '',
      historia: time.historia?.trim() || '',
      titulos: (time.titulosTexto || '').split('\n').map((s) => s.trim()).filter(Boolean),
      foto: time.foto || '',
    }
    const lista = [...times]
    if (time.idx != null) lista[time.idx] = t
    else lista.push(t)
    persistir(lista)
    setTime(null)
  }

  const remover = (idx) => {
    if (!window.confirm('Remover este time?')) return
    persistir(times.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <PageTitle title="Equipes" subtitle="Os times do campeonato — escudo, história e títulos">
        <div className="flex items-center gap-2">
          {salvo && <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"><Check className="h-4 w-4" />Salvo</span>}
          <button type="button" onClick={() => setTime({ nome: '', escudo: '', historia: '', titulosTexto: '', foto: '' })} className={btnAccent}>
            <Plus className="h-4 w-4" />
            Novo time
          </button>
        </div>
      </PageTitle>

      <div className="space-y-3">
        {times.map((t, idx) => (
          <Card key={idx} className="flex items-center gap-4 p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-navy-900">
              {t.escudo && <img src={t.escudo} alt="" className="h-full w-full object-contain p-1" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-sm font-bold text-navy-900">{t.nome}</h3>
              <p className="mt-0.5 text-xs text-navy-500">
                {t.titulos?.length ? `${t.titulos.length} título(s)` : 'Sem títulos'} ·{' '}
                {t.historia ? 'com história' : 'sem história'}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setTime({ idx, nome: t.nome, escudo: t.escudo || '', historia: t.historia || '', titulosTexto: (t.titulos || []).join('\n'), foto: t.foto || '' })} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => remover(idx)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
        {times.length === 0 && <Card className="text-sm text-navy-500">Nenhum time. Clique em "Novo time".</Card>}
      </div>

      {time && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={salvarTime} className="my-8 w-full max-w-lg rounded-2xl bg-paper p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-navy-900">{time.idx != null ? 'Editar time' : 'Novo time'}</h2>
              <button type="button" onClick={() => setTime(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Nome do time *"><input required value={time.nome} onChange={(e) => setTime((p) => ({ ...p, nome: e.target.value }))} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Escudo"><UploadEscudo value={time.escudo} onChange={(v) => setTime((p) => ({ ...p, escudo: v }))} /></Field>
                <Field label="Foto do time" hint="Alterna com o escudo.">
                  <UploadEscudo value={time.foto} onChange={(v) => setTime((p) => ({ ...p, foto: v }))} />
                </Field>
              </div>
              <Field label="História"><textarea rows={4} value={time.historia} onChange={(e) => setTime((p) => ({ ...p, historia: e.target.value }))} className={`${inputCls} resize-y`} placeholder="Um pouco da história do time..." /></Field>
              <Field label="Títulos" hint="Um por linha.">
                <textarea rows={3} value={time.titulosTexto} onChange={(e) => setTime((p) => ({ ...p, titulosTexto: e.target.value }))} className={`${inputCls} resize-y`} placeholder={'Campeão TFA 2024\nVice-campeão Copa Handebol'} />
              </Field>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs text-navy-400"><Trophy className="h-3.5 w-3.5" />Os títulos aparecem com um troféu no site.</span>
              <div className="flex gap-3">
                <button type="button" onClick={() => setTime(null)} className={btnGhost}>Cancelar</button>
                <button type="submit" className={btnPrimary}>Salvar time</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
