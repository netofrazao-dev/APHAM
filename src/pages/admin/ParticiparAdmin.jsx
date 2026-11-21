import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { conteudoParticipar, listaFaq } from '../../lib/conteudo'
import { PageTitle, Card, Field, inputCls } from './ui'
import { ListaEditavel, ListaTextos, BarraSalvar, useRascunho } from './ListaEditavel'

// "Participar" (página /participar e seção da home): textos, horários de treino,
// passos para entrar e o que levar no primeiro dia. E as perguntas frequentes.

const ICONES = [
  ['MessageCircle', 'Conversa (WhatsApp)'],
  ['ClipboardList', 'Prancheta (inscrição)'],
  ['Users', 'Pessoas (treino)'],
  ['CalendarClock', 'Calendário'],
  ['MapPin', 'Local'],
  ['FileText', 'Documento'],
  ['Shirt', 'Uniforme'],
  ['HeartHandshake', 'Apoio'],
]

export default function ParticiparAdmin() {
  const { settings, updateSettings } = useStore()
  const p = conteudoParticipar(settings)
  const r = useRascunho(
    {
      eyebrow: p.eyebrow || '',
      titulo: p.titulo || '',
      descricao: p.descricao || '',
      provisorio: Boolean(p.provisorio),
      horarios: p.horarios || [],
      passos: p.passos || [],
      requisitos: p.requisitos || [],
      faq: listaFaq(settings),
    },
    ({ faq, ...participar }) =>
      updateSettings({
        participar: {
          ...participar,
          requisitos: participar.requisitos.map((t) => t.trim()).filter(Boolean),
        },
        faq: faq.filter((f) => f.pergunta?.trim()),
      })
  )
  const f = r.form
  const set = (k, v) => r.setForm((x) => ({ ...x, [k]: v }))

  return (
    <div>
      <PageTitle title="Participar" subtitle="Treinos, inscrição e perguntas frequentes — o que aparece em “Participar” no site">
        <Link to="/participar" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline">
          Ver no site
          <ExternalLink className="h-4 w-4" />
        </Link>
      </PageTitle>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 font-display font-bold text-navy-900">Textos do topo</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Chamada pequena" hint="Aparece acima do título.">
              <input value={f.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Título">
              <input value={f.titulo} onChange={(e) => set('titulo', e.target.value)} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Descrição">
                <textarea rows={3} value={f.descricao} onChange={(e) => set('descricao', e.target.value)} className={`${inputCls} resize-y`} />
              </Field>
            </div>
          </div>
          <p className="mt-3 text-xs text-navy-400">O botão “Quero participar” abre o WhatsApp da APHAM (o número fica em Configurações).</p>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Horários de treino</h2>
          <p className="mb-4 text-sm text-navy-500">Uma turma por item. Use as setas para mudar a ordem.</p>
          <ListaEditavel
            itens={f.horarios}
            onChange={(v) => set('horarios', v)}
            titulo={(h, i) => h.turma || `Turma ${i + 1}`}
            novo={{ turma: '', dias: '', horario: '', local: '' }}
            rotuloNovo="Adicionar turma"
            vazio="Nenhuma turma cadastrada."
            campos={[
              { k: 'turma', rotulo: 'Turma / categoria', dica: 'Ex.: Categoria Feminina', col: 'sm:col-span-6' },
              { k: 'dias', rotulo: 'Dias', dica: 'Ex.: Seg · Qua · Sex', col: 'sm:col-span-2' },
              { k: 'horario', rotulo: 'Horário', dica: 'Ex.: 08h – 10h', col: 'sm:col-span-2' },
              { k: 'local', rotulo: 'Local', dica: 'Ex.: Ginásio Municipal — Breves/PA', col: 'sm:col-span-2' },
            ]}
          />
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={f.provisorio} onChange={(e) => set('provisorio', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
            Mostrar aviso “horários provisórios, confirme antes de ir”
          </label>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Como participar (passo a passo)</h2>
          <p className="mb-4 text-sm text-navy-500">Os passos aparecem numerados no site, nesta ordem.</p>
          <ListaEditavel
            itens={f.passos}
            onChange={(v) => set('passos', v)}
            titulo={(s, i) => `Passo ${i + 1}${s.titulo ? ` — ${s.titulo}` : ''}`}
            novo={{ icone: 'Users', titulo: '', texto: '' }}
            rotuloNovo="Adicionar passo"
            campos={[
              { k: 'titulo', rotulo: 'Título', dica: 'Ex.: Faça a inscrição', col: 'sm:col-span-4' },
              { k: 'icone', rotulo: 'Ícone', tipo: 'select', opcoes: ICONES, col: 'sm:col-span-2' },
              { k: 'texto', rotulo: 'Explicação', tipo: 'area', linhas: 2 },
            ]}
          />
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Para o primeiro dia</h2>
          <p className="mb-4 text-sm text-navy-500">O que a pessoa precisa saber ou levar. Uma frase por linha.</p>
          <ListaTextos itens={f.requisitos} onChange={(v) => set('requisitos', v)} dica="Ex.: Roupa leve, tênis e garrafa de água." />
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Perguntas frequentes</h2>
          <p className="mb-4 text-sm text-navy-500">Aparecem na página de contato e na home. Responda do jeito que você responderia no WhatsApp.</p>
          <ListaEditavel
            itens={f.faq}
            onChange={(v) => set('faq', v)}
            titulo={(q, i) => q.pergunta || `Pergunta ${i + 1}`}
            novo={{ pergunta: '', resposta: '' }}
            rotuloNovo="Adicionar pergunta"
            campos={[
              { k: 'pergunta', rotulo: 'Pergunta', dica: 'Ex.: Quanto custa treinar?' },
              { k: 'resposta', rotulo: 'Resposta', tipo: 'area', linhas: 3 },
            ]}
          />
        </Card>
      </div>

      <BarraSalvar alterado={r.alterado} salvo={r.salvo} onSalvar={r.salvar} onDescartar={r.descartar} />
    </div>
  )
}
