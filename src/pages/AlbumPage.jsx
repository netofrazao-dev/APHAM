import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Camera } from 'lucide-react'
import PageShell from '../components/PageShell'
import Gallery from '../components/Gallery'
import Reveal from '../components/Reveal'
import { albuns } from '../data/content'
import { youtubeEmbed } from '../lib/youtube'

// Página de um álbum da galeria (/galeria/:slug): fotos (com tela cheia) e vídeos.
export default function AlbumPage() {
  const { slug } = useParams()
  const album = albuns.find((a) => a.slug === slug)

  useEffect(() => {
    if (album) document.title = `${album.titulo} · Galeria · APHAM`
  }, [album])

  if (!album) {
    return (
      <PageShell eyebrow="Galeria" titulo="Álbum não encontrado">
        <section className="section-pad py-16 text-center">
          <Link to="/galeria" className="btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a galeria
          </Link>
        </section>
      </PageShell>
    )
  }

  const vazio = !album.fotos.length && !album.videos.length

  return (
    <PageShell eyebrow="Galeria" titulo={album.titulo} descricao={album.descricao}>
      <div className="section-pad pt-10">
        <div className="container-x flex flex-wrap items-center justify-center gap-3">
          <Link to="/galeria" className="btn border border-navy-200 bg-white text-navy-800 hover:bg-navy-50">
            <ArrowLeft className="h-4 w-4" />
            Toda a galeria
          </Link>
          {album.pagina && (
            <Link to={album.pagina.to} className="btn-primary">
              {album.pagina.rotulo}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {vazio && (
        <section className="section-pad py-16">
          <Reveal className="container-x max-w-2xl rounded-3xl border border-dashed border-navy-200 bg-white p-10 text-center">
            <Camera className="mx-auto h-10 w-10 text-cyan-500" />
            <h2 className="mt-4 font-display text-2xl font-extrabold text-navy-900">Fotos e vídeos em breve</h2>
            <p className="mt-3 text-ink/70">Os registros deste álbum estão sendo organizados e chegam aqui em breve.</p>
          </Reveal>
        </section>
      )}

      {album.fotos.length > 0 && (
        <Gallery itens={album.fotos} id="fotos" eyebrow="Fotos" titulo={`${album.titulo} em imagens`} texto="Toque numa foto para ver em tela cheia." />
      )}

      {album.videos.length > 0 && (
        <section id="videos" className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
          <div className="container-x">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="eyebrow flex justify-center">
                <span className="h-px w-6 bg-cyan-400" />
                Vídeos
                <span className="h-px w-6 bg-cyan-400" />
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900">{album.titulo} em vídeo</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {album.videos.map((v, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <figure className="overflow-hidden rounded-2xl bg-navy-950 shadow-lift">
                    <div className="aspect-video">
                      {v.url ? (
                        <iframe
                          src={youtubeEmbed(v.url)}
                          title={v.titulo}
                          loading="lazy"
                          className="h-full w-full"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video src={v.arquivo} poster={v.poster} controls preload="none" className="h-full w-full object-contain" />
                      )}
                    </div>
                    {v.titulo && <figcaption className="p-4 text-sm font-semibold text-white">{v.titulo}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  )
}
