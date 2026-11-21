import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { conteudoSobre } from '../../lib/conteudo'
import { PageTitle, Card, Field, inputCls } from './ui'
import { ListaEditavel, BarraSalvar, useRascunho } from './ListaEditavel'

// "Quem somos" (seção Sobre da home e página /quem-somos): história, missão,
// lema e os destaques ao lado da foto.

export default function SobreAdmin() {
  const { settings, updateSettings } = useStore()
  const s = conteudoSobre(settings)
  const r = useRascunho(
    {
      titulo: s.titulo || '',
      paragrafos: s.paragrafos || [],
      missao: s.missao || '',
      lemaTitulo: s.lemaTitulo || '',
      lema: s.lema || '',
      destaques: (s.destaques || []).slice(0, 2),
    },
    (form) => updateSettings({ sobre: { ...form, paragrafos: form.paragrafos.map((t) => t.trim()).filter(Boolean) } })
  )
  const f = r.form
  const set = (k, v) => r.setForm((x) => ({ ...x, [k]: v }))

  return (
    <div>
      <PageTitle title="Quem somos" subtitle="A apresentação da APHAM: história, missão e lema">
        <Link to="/quem-somos" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline">
          Ver no site
          <ExternalLink className="h-4 w-4" />
        </Link>
      </PageTitle>

      <div className="space-y-6">
        <Card>
          <Field label="Título">
            <input value={f.titulo} onChange={(e) => set('titulo', e.target.value)} className={inputCls} />
          </Field>
          <p className="mb-2 mt-5 text-sm font-semibold text-navy-800">Texto de apresentação</p>
          <p className="mb-3 text-xs text-navy-400">Cada caixa é um parágrafo.</p>
          <div className="space-y-3">
            {f.paragrafos.map((t, i) => (
              <textarea
                key={i}
                rows={4}
                value={t}
                onChange={(e) => set('paragrafos', f.paragrafos.map((x, n) => (n === i ? e.target.value : x)))}
                className={`${inputCls} resize-y`}
                placeholder="Escreva o parágrafo… (apague todo o texto para remover)"
              />
            ))}
          </div>
          <button type="button" onClick={() => set('paragrafos', [...f.paragrafos, ''])} className="mt-3 rounded-xl border border-dashed border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50">
            + Adicionar parágrafo
          </button>
        </Card>

        <Card>
          <Field label="Missão">
            <textarea rows={4} value={f.missao} onChange={(e) => set('missao', e.target.value)} className={`${inputCls} resize-y`} />
          </Field>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Lema (título)">
              <input value={f.lemaTitulo} onChange={(e) => set('lemaTitulo', e.target.value)} className={inputCls} placeholder="HANDEBOL · MARAJÓ · PARÁ" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Lema (explicação)">
                <textarea rows={2} value={f.lema} onChange={(e) => set('lema', e.target.value)} className={`${inputCls} resize-y`} />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Selos ao lado da foto</h2>
          <p className="mb-4 text-sm text-navy-500">Dois destaques curtos (ex.: ano de fundação e reconhecimento).</p>
          <ListaEditavel
            itens={f.destaques}
            onChange={(v) => set('destaques', v.slice(0, 2))}
            titulo={(d, i) => `Selo ${i + 1}`}
            novo={{ titulo: '', texto: '' }}
            rotuloNovo="Adicionar selo"
            campos={[
              { k: 'titulo', rotulo: 'Título', dica: 'Ex.: Fundada em 2009', col: 'sm:col-span-2' },
              { k: 'texto', rotulo: 'Texto', dica: 'Ex.: Mais de 15 anos de história no Marajó.', col: 'sm:col-span-4' },
            ]}
          />
        </Card>
      </div>

      <BarraSalvar alterado={r.alterado} salvo={r.salvo} onSalvar={r.salvar} onDescartar={r.descartar} />
    </div>
  )
}
