import PageShell from '../components/PageShell'
import Cooperativa from '../components/Cooperativa'
import StoreTeaser from '../components/StoreTeaser'

export default function CooperativaPage() {
  return (
    <PageShell
      eyebrow="Cooperativa Social"
      titulo="Cooperativa Social da APHAM"
      descricao="O esporte como ferramenta de trabalho, renda e inclusão na comunidade marajoara."
    >
      <Cooperativa />
      <StoreTeaser />
    </PageShell>
  )
}
