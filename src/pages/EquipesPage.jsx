import PageShell from '../components/PageShell'
import Equipes from '../components/Equipes'

export default function EquipesPage() {
  return (
    <PageShell
      eyebrow="Nossas equipes"
      titulo="Quem faz a APHAM acontecer"
      descricao="Atletas, técnicos e voluntários que vestem a camisa do handebol do Marajó."
    >
      <Equipes />
    </PageShell>
  )
}
