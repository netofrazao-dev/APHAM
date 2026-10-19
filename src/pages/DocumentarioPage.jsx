import PageShell from '../components/PageShell'
import Documentario from '../components/Documentario'

export default function DocumentarioPage() {
  return (
    <PageShell
      eyebrow="Documentário"
      titulo="O documentário da APHAM"
      descricao="A história da associação contada em capítulos — assista aqui mesmo, direto no site."
    >
      <Documentario />
    </PageShell>
  )
}
