import PageShell from '../components/PageShell'
import Cooperativa from '../components/Cooperativa'

export default function CooperativaPage() {
  return (
    <PageShell
      eyebrow="Cooperativa Social"
      titulo="Cooperativa Social da APHAM"
      descricao="O esporte como ferramenta de trabalho, renda e inclusão na comunidade marajoara."
    >
      <Cooperativa />
    </PageShell>
  )
}
