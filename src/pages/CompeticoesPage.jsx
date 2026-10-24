import PageShell from '../components/PageShell'
import Events from '../components/Events'
import AgendaCompleta from '../components/AgendaCompleta'

export default function CompeticoesPage() {
  return (
    <PageShell
      eyebrow="Eventos e campeonatos"
      titulo="Competições da APHAM"
      descricao="Campeonatos, oficinas e ações sociais que marcaram a trajetória do handebol marajoara."
    >
      <AgendaCompleta />
      <Events />
    </PageShell>
  )
}
