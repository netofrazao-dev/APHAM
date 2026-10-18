import PageShell from '../components/PageShell'
import About from '../components/About'
import Values from '../components/Values'
import Awards from '../components/Awards'
import Cooperativa from '../components/Cooperativa'
import TaxIncentive from '../components/TaxIncentive'

export default function Projetos() {
  return (
    <PageShell
      eyebrow="A APHAM"
      titulo="Quem somos e nossos projetos"
      descricao="A história, a missão e os reconhecimentos da Associação de Praticantes de Handebol do Marajó."
    >
      <About />
      <Values />
      <Awards />
      <Cooperativa />
      <TaxIncentive />
    </PageShell>
  )
}
