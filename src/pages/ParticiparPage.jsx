import PageShell from '../components/PageShell'
import Participar from '../components/Participar'

export default function ParticiparPage() {
  return (
    <PageShell
      eyebrow="Faça parte"
      titulo="Participar da APHAM"
      descricao="Horários de treino, como se inscrever e tudo que você precisa para começar."
    >
      <Participar />
    </PageShell>
  )
}
