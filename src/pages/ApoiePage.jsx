import PageShell from '../components/PageShell'
import Support from '../components/Support'
import Doacao from '../components/Doacao'

export default function ApoiePage() {
  return (
    <PageShell
      eyebrow="Envolva-se"
      titulo="Apoie o nosso projeto"
      descricao="Seja voluntário, faça uma doação ou vire parceiro — cada gesto fortalece o handebol do Marajó."
    >
      <Support />
      <Doacao />
    </PageShell>
  )
}
