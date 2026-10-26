import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Camera, Expand, Film } from 'lucide-react'
import PageShell from '../components/PageShell'
import Videos from '../components/Videos'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import { albuns } from '../data/content'
import { youtubeEmbed } from '../lib/youtube'

const doisDigitos = (n) => String(n).padStart(2, '0')
const irPara = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// Página de um álbum da galeria (/galeria/:slug): mosaico de abertura, números,
// fotos por capítulo (com tela cheia) e vídeos.
export default function AlbumPage() {
  const { slug } = useParams()
  const album = albuns.find((a) => a.slug === slug)
  const [idx, setIdx] = useState(null)

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

  // Álbum sem capítulos vira um capítulo só, sem título.
  const capitulos = album.capitulos ?? (album.fotos?.length ? [{ titulo: '', fotos: album.fotos }] : [])
  const todas = capitulos.flatMap((c) => c.fotos.map((f) => ({ ...f, grupo: c.titulo })))
  const inicio = capitulos.map((_, ci) => capitulos.slice(0, ci).reduce((s, c) => s + c.fotos.length, 0))
  const destaques = (album.destaques || []).map((nome) => todas.findIndex((f) => f.nome === nome)).filter((i) => i >= 0)
  const videosArquivo = album.videos.filter((v) => !v.url)
  const videosYoutube = album.videos.filter((v) => v.url)
  const vazio = !todas.length && !album.videos.length
  const numeros = album.numeros || []
  const comTitulo = capitulos.filter((c) => c.titulo).length > 1
  const resumo = [
    todas.length && `${todas.length} fotos`,
    album.videos.length && `${album.videos.length} vídeos`,
  ].filter(Boolean)

  return (
    <PageShell eyebrow="Galeria" titulo={album.titulo} descricao={album.descricao}>
      <section className="section-pad pt-10 lg:pt-12">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-center gap-3">
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

          {destaques.length === 3 && (
            <Reveal className="mt-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:h-[32rem] md:grid-cols-3 md:grid-rows-2">
                {destaques.map((i, k) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`group relative overflow-hidden rounded-3xl bg-navy-100 shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                      k === 0 ? 'col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto' : 'aspect-[4/3] md:aspect-auto'
                    }`}
                  >
                    <img
                      src={k === 0 ? todas[i].img : todas[i].mini || todas[i].img}
                      alt={todas[i].legenda}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/0 to-transparent" />
                    <span
                      className={`absolute inset-x-0 bottom-0 p-4 text-left font-semibold text-white drop-shadow sm:p-5 ${
                        k === 0 ? 'text-sm sm:text-lg' : 'hidden text-sm sm:block'
                      }`}
                    >
                      {todas[i].legenda}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {numeros.length > 0 && (
            <Reveal className="mt-6">
              <dl
                className="grid gap-2 rounded-3xl bg-navy-950 p-2 shadow-lift sm:gap-3 sm:p-4"
                style={{ gridTemplateColumns: `repeat(${Math.min(numeros.length, 4)}, minmax(0, 1fr))` }}
              >
                {numeros.map((n) => (
                  <div key={n.label} className="flex flex-col rounded-2xl bg-white/[0.06] px-2 py-4 text-center ring-1 ring-white/10 sm:px-4">
                    <dt className="mt-1 text-xs font-medium text-cyan-200/80">{n.label}</dt>
                    <dd className="order-first font-display text-2xl font-extrabold text-white sm:text-3xl">{n.valor}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {resumo.length > 0 && (
            <p className="mt-8 text-center text-sm font-medium text-navy-500">
              {resumo.join(' e ')}
              {comTitulo && `, em ${capitulos.length} partes`}
            </p>
          )}

          {comTitulo && (
            <nav className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Partes do álbum">
              {capitulos.map((c, ci) => (
                <button
                  key={ci}
                  type="button"
                  onClick={() => irPara(`parte-${ci + 1}`)}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-cyan-400 hover:text-cyan-700"
                >
                  <span className="tabular-nums text-cyan-600">{doisDigitos(ci + 1)}</span>
                  {c.titulo}
                </button>
              ))}
              {videosArquivo.length > 0 && (
                <button
                  type="button"
                  onClick={() => irPara('videos')}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-cyan-400 hover:text-cyan-700"
                >
                  <Film className="h-4 w-4 text-cyan-600" />
                  Vídeos
                </button>
              )}
            </nav>
          )}
        </div>
      </section>

      {vazio && (
        <section className="section-pad py-16">
          <Reveal className="container-x max-w-2xl rounded-3xl border border-dashed border-navy-200 bg-white p-10 text-center">
            <Camera className="mx-auto h-10 w-10 text-cyan-500" />
            <h2 className="mt-4 font-display text-2xl font-extrabold text-navy-900">Fotos e vídeos em breve</h2>
            <p className="mt-3 text-ink/70">Os registros deste álbum estão sendo organizados e chegam aqui em breve.</p>
          </Reveal>
        </section>
      )}

      {capitulos.map((c, ci) => (
        <section
          key={ci}
          id={`parte-${ci + 1}`}
          className={`section-pad scroll-mt-24 py-14 lg:py-20 ${ci % 2 === 1 ? 'bg-white' : ''}`}
        >
          <div className="container-x">
            {c.titulo && (
              <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
                <span className="font-display text-6xl font-extrabold leading-none text-cyan-500/30 sm:text-7xl">
                  {doisDigitos(ci + 1)}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{c.titulo}</h2>
                  {c.texto && <p className="mt-2 max-w-3xl leading-relaxed text-ink/70">{c.texto}</p>}
                </div>
                <span className="text-sm font-medium text-navy-400">{c.fotos.length} fotos</span>
              </Reveal>
            )}

            <Reveal>
              <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
                {c.fotos.map((f, fi) => (
                  <button
                    key={f.img}
                    type="button"
                    onClick={() => setIdx(inicio[ci] + fi)}
                    className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-navy-100 shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:mb-4"
                  >
                    <img
                      src={f.mini || f.img}
                      alt={f.legenda}
                      loading="lazy"
                      decoding="async"
                      width={720}
                      height={f.vertical ? 960 : 405}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        f.vertical ? 'aspect-[3/4] object-[50%_35%]' : 'aspect-video'
                      }`}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-950/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 hidden translate-y-2 p-4 text-left text-sm font-semibold text-white opacity-0 drop-shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                      {f.legenda}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {videosArquivo.length > 0 && (
        <Videos
          itens={videosArquivo}
          eyebrow="Vídeos"
          titulo={album.videosTitulo || `${album.titulo} em vídeo`}
          texto={album.videosTexto}
          grade="sm:grid-cols-2 lg:grid-cols-3"
          className={capitulos.length % 2 === 1 ? 'bg-white' : ''}
        />
      )}

      {videosYoutube.length > 0 && (
        <section className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
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
              {videosYoutube.map((v, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <figure className="overflow-hidden rounded-2xl bg-navy-950 shadow-lift">
                    <div className="aspect-video">
                      <iframe
                        src={youtubeEmbed(v.url)}
                        title={v.titulo}
                        loading="lazy"
                        className="h-full w-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    {v.titulo && <figcaption className="p-4 text-sm font-semibold text-white">{v.titulo}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {album.pagina && !vazio && (
        <section className="section-pad py-16 lg:py-20">
          <Reveal className="container-x">
            <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-12 text-center shadow-lift sm:px-12 sm:py-14">
              <img src={album.capa} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/60" />
              <div className="relative">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {album.chamada?.titulo || 'Conheça a história completa'}
                </h2>
                {album.chamada?.texto && <p className="mx-auto mt-3 max-w-xl text-white/70">{album.chamada.texto}</p>}
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link to={album.pagina.to} className="btn-primary">
                    {album.pagina.rotulo}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link to="/galeria" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4" />
                    Toda a galeria
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {idx !== null && <Lightbox itens={todas} idx={idx} onChange={setIdx} onClose={() => setIdx(null)} />}
    </PageShell>
  )
}
