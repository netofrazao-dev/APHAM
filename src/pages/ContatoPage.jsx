import PageShell from '../components/PageShell'
import Contact from '../components/Contact'
import Faq from '../components/Faq'

export default function ContatoPage() {
  return (
    <PageShell
      eyebrow="Fale conosco"
      titulo="Entre em contato com a APHAM"
      descricao="Tire dúvidas, proponha parcerias ou venha treinar — estamos à disposição."
    >
      <Contact />
      <Faq />
    </PageShell>
  )
}
