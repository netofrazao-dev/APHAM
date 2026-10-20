import PageShell from '../components/PageShell'
import ProjetosDestaque from '../components/ProjetosDestaque'

export default function Projetos() {
  return (
    <PageShell
      eyebrow="Projetos"
      titulo="Projetos da APHAM"
      descricao="Conheça os projetos que levam o handebol, a educação e a inclusão às comunidades do Marajó."
    >
      <ProjetosDestaque />
    </PageShell>
  )
}
