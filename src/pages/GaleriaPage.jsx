import PageShell from '../components/PageShell'
import Stories from '../components/Stories'
import Gallery from '../components/Gallery'
import Videos from '../components/Videos'

export default function GaleriaPage() {
  return (
    <PageShell
      eyebrow="Galeria"
      titulo="A APHAM em imagens e vídeos"
      descricao="Fotos e vídeos da associação — a nossa história registrada."
    >
      <Stories />
      <Gallery />
      <Videos />
    </PageShell>
  )
}
