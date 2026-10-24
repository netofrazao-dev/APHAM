import PageShell from '../components/PageShell'
import Gallery from '../components/Gallery'
import Videos from '../components/Videos'
import Albuns from '../components/Albuns'

export default function GaleriaPage() {
  return (
    <PageShell
      eyebrow="Galeria"
      titulo="A APHAM em imagens e vídeos"
      descricao="Fotos e vídeos da associação — a nossa história registrada."
    >
      <Albuns />
      <Gallery />
      <Videos />
    </PageShell>
  )
}
