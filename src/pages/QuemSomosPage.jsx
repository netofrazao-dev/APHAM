import PageShell from '../components/PageShell'
import About from '../components/About'
import Values from '../components/Values'

export default function QuemSomosPage() {
  return (
    <PageShell
      eyebrow="A APHAM"
      titulo="Quem somos"
      descricao="A história, a missão e os valores da Associação de Praticantes de Handebol do Marajó."
    >
      <About />
      <Values />
    </PageShell>
  )
}
