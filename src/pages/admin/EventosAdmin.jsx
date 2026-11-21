import { ExternalLink, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { listaEventos } from '../../lib/conteudo'
import { PageTitle, Card } from './ui'
import { ListaEditavel, BarraSalvar, useRascunho } from './ListaEditavel'

// Competições e eventos (cards com foto e história na página /competicoes e na
// home). As datas da agenda ficam em Calendário.

const TAGS = [
  ['Campeonato', 'Campeonato'],
  ['Competição', 'Competição'],
  ['Torneio', 'Torneio'],
  ['Festival', 'Festival'],
  ['Ação social', 'Ação social'],
  ['Formação', 'Formação'],
  ['Evento', 'Evento'],
]

export default function EventosAdmin() {
  const { settings, updateSettings } = useStore()
  const r = useRascunho({ eventos: listaEventos(settings) }, ({ eventos }) => updateSettings({ eventos: eventos.filter((e) => e.nome?.trim()) }))

  return (
    <div>
      <PageTitle title="Competições e eventos" subtitle="Campeonatos, torneios e ações da APHAM — cada um com foto e história">
        <Link to="/competicoes" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline">
          Ver no site
          <ExternalLink className="h-4 w-4" />
        </Link>
      </PageTitle>

      <Card className="mb-4 flex items-start gap-3 bg-cyan-50/60 text-sm text-navy-700">
        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
        <p>
          Aqui ficam os cards com a <strong>história</strong> de cada competição ou evento. As <strong>datas</strong> (agenda e “próximos eventos”) ficam em{' '}
          <Link to="/admin/calendario" className="font-semibold text-cyan-700 hover:underline">
            Calendário
          </Link>
          .
        </p>
      </Card>

      <Card>
        <ListaEditavel
          itens={r.form.eventos}
          onChange={(v) => r.setForm({ eventos: v })}
          titulo={(e, i) => e.nome || `Evento ${i + 1}`}
          novo={{ nome: '', tag: 'Campeonato', ano: String(new Date().getFullYear()), local: 'Breves — Marajó', img: '', resumo: '', historia: '' }}
          rotuloNovo="Adicionar competição ou evento"
          vazio="Nenhum evento cadastrado."
          campos={[
            { k: 'img', rotulo: 'Foto', tipo: 'foto', col: 'sm:col-span-2' },
            { k: 'nome', rotulo: 'Nome', dica: 'Ex.: TFA — Taça das Fronteiras Amazônicas', col: 'sm:col-span-4' },
            { k: 'tag', rotulo: 'Tipo', tipo: 'select', opcoes: TAGS, col: 'sm:col-span-2' },
            { k: 'ano', rotulo: 'Ano', dica: 'Ex.: 2026', col: 'sm:col-span-1' },
            { k: 'local', rotulo: 'Local', dica: 'Ex.: Breves — Marajó', col: 'sm:col-span-3' },
            { k: 'resumo', rotulo: 'Resumo (aparece no card)', tipo: 'area', linhas: 2, dica: 'Uma ou duas frases.' },
            { k: 'historia', rotulo: 'História completa (abre em “Ler a história”)', tipo: 'area', linhas: 5, dica: 'Como foi, quem participou, resultados, campeões…' },
          ]}
        />
      </Card>

      <BarraSalvar alterado={r.alterado} salvo={r.salvo} onSalvar={r.salvar} onDescartar={r.descartar} />
    </div>
  )
}
