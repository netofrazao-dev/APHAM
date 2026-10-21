import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Radio, StopCircle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { youtubeId } from '../../lib/youtube'
import { PageTitle, Card, Field, inputCls, btnAccent, btnGhost, btnPrimary, btnDanger } from './ui'

export default function LivesAdmin() {
  const { lives, saveLive, deleteLive, settings, updateSettings } = useStore()
  const [jogo, setJogo] = useState(null)

  const aoVivo = settings?.aoVivoAtivo && settings?.aoVivoUrl
  const idAoVivo = aoVivo ? youtubeId(settings.aoVivoUrl) : null

  const salvar = (e) => {
    e.preventDefault()
    const id = youtubeId(jogo.link || jogo.id || '')
    if (!id) {
      alert('Cole um link válido de um vídeo do YouTube.')
      return
    }
    // Se trocou o vídeo de um jogo existente, remove o registro antigo.
    if (jogo.id && jogo.id !== id) deleteLive(jogo.id)
    saveLive({ id, torneio: (jogo.torneio || '').trim(), titulo: (jogo.titulo || '').trim() })
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
      <PageTitle title="Lives APHAM" subtitle="Jogos transmitidos no YouTube e o que está ao vivo">
        <button
          type="button"
          onClick={() => setJogo({ torneio: 'TFA', titulo: '', link: '' })}
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

      {/* Lista de jogos */}
      <div className="space-y-3">
        {lives.map((j) => {
          const vivo = idAoVivo && idAoVivo === j.id
          return (
            <Card key={j.id} className="flex items-center gap-4 p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                <img src={`https://i.ytimg.com/vi/${j.id}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-cyan-600">{j.torneio}</p>
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
        {lives.length === 0 && <Card className="text-sm text-navy-500">Nenhum jogo cadastrado.</Card>}
      </div>

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
              <Field label="Torneio">
                <input value={jogo.torneio} onChange={(e) => setJogo((p) => ({ ...p, torneio: e.target.value }))} className={inputCls} placeholder="TFA" />
              </Field>
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
