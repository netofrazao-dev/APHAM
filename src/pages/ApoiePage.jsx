import PageShell from '../components/PageShell'
import Support from '../components/Support'

export default function ApoiePage() {
  return (
    <PageShell
      eyebrow="Envolva-se"
      titulo="Apoie o nosso projeto"
      descricao="Seja voluntário, faça uma doação ou vire parceiro — cada gesto fortalece o handebol do Marajó."
    >
      <Support />
    </PageShell>
  )
}
