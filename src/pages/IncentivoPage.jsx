import PageShell from '../components/PageShell'
import TaxIncentive from '../components/TaxIncentive'

export default function IncentivoPage() {
  return (
    <PageShell
      eyebrow="Imposto de Renda"
      titulo="Lei de Incentivo ao Esporte"
      descricao="Apoie a APHAM destinando parte do seu Imposto de Renda — sem custo extra para você."
    >
      <TaxIncentive />
    </PageShell>
  )
}
