import PageShell from '../components/PageShell'
import Events from '../components/Events'

export default function CompeticoesPage() {
  return (
    <PageShell
      eyebrow="Eventos e campeonatos"
      titulo="Competições da APHAM"
      descricao="Campeonatos, oficinas e ações sociais que marcaram a trajetória do handebol marajoara."
    >
      <Events />
    </PageShell>
  )
}
