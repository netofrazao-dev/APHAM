import PageShell from '../components/PageShell'
import Awards from '../components/Awards'

export default function ReconhecimentosPage() {
  return (
    <PageShell
      eyebrow="Credenciais"
      titulo="Prêmios Nacionais e Certificações"
      descricao="Prêmios, certificações e respaldo oficial que atestam a seriedade do trabalho da APHAM."
    >
      <Awards />
    </PageShell>
  )
}
