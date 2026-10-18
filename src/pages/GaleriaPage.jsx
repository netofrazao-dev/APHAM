import PageShell from '../components/PageShell'
import Gallery from '../components/Gallery'
import Videos from '../components/Videos'
import Documentario from '../components/Documentario'

export default function GaleriaPage() {
  return (
    <PageShell
      eyebrow="Galeria"
      titulo="A APHAM em imagens e vídeos"
      descricao="Fotos, vídeos e o documentário da associação — a nossa história registrada."
    >
      <Gallery />
      <Videos />
      <Documentario />
    </PageShell>
  )
}
