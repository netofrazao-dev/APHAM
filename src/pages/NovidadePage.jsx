import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Link2, Quote, Share2, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import PageShell from '../components/PageShell'
import Reveal from '../components/Reveal'
import { useStore } from '../store/StoreContext'
import { youtubeEmbed } from '../lib/youtube'
import { site } from '../data/content'

// Página de uma notícia (/novidades/:id), montada pelo painel (/admin → Novidades):
// capa, título, linha fina, texto principal e blocos extras (subtítulo, texto,
// imagem, galeria, vídeo, citação e botão), na ordem escolhida no painel.

const paragrafos = (t) => (t || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

function Lightbox({ fotos, idx, setIdx }) {
  useEffect(() => {
    if (idx === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIdx(null)
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % fotos.length)
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + fotos.length) % fotos.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [idx, fotos.length, setIdx])
  if (idx === null) return null
  const nav = (d) => (e) => {
    e.stopPropagation()
    setIdx((i) => (i + d + fotos.length) % fotos.length)
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4" onClick={() => setIdx(null)}>
      <button type="button" aria-label="Fechar" onClick={() => setIdx(null)} className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <X className="h-5 w-5" />
      </button>
      {fotos.length > 1 && (
        <button type="button" aria-label="Anterior" onClick={nav(-1)} className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      <img src={fotos[idx]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
      {fotos.length > 1 && (
        <button type="button" aria-label="Próxima" onClick={nav(1)} className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

function Bloco({ b, abrirFoto }) {
  if (b.tipo === 'subtitulo') return <h2 className="mt-12 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{b.texto}</h2>
  if (b.tipo === 'texto')
    return paragrafos(b.texto).map((p, i) => (
      <p key={i} className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink/80 sm:text-lg">{p}</p>
    ))
  if (b.tipo === 'imagem' && b.img)
    return (
      <figure className="mt-10">
        <button type="button" onClick={() => abrirFoto(b.img)} className="block w-full overflow-hidden rounded-2xl shadow-lift">
          <img src={b.img} alt={b.legenda || ''} loading="lazy" className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
        </button>
        {b.legenda && <figcaption className="mt-3 text-center text-sm text-ink/60">{b.legenda}</figcaption>}
      </figure>
    )
  if (b.tipo === 'galeria' && b.imgs?.length)
    return (
      <div className="mt-10">
        {b.titulo && <h3 className="mb-4 font-display text-xl font-extrabold text-navy-900">{b.titulo}</h3>}
        <div className={`grid gap-3 ${b.imgs.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {b.imgs.map((src, i) => (
            <button key={i} type="button" onClick={() => abrirFoto(src)} className="group aspect-square overflow-hidden rounded-xl bg-navy-100 shadow-soft">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
    )
  if (b.tipo === 'video' && youtubeEmbed(b.url))
    return (
      <figure className="mt-10">
        <div className="aspect-video overflow-hidden rounded-2xl bg-navy-950 shadow-lift">
          <iframe
            src={youtubeEmbed(b.url)}
            title={b.legenda || 'Vídeo'}
            loading="lazy"
            className="h-full w-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        {b.legenda && <figcaption className="mt-3 text-center text-sm text-ink/60">{b.legenda}</figcaption>}
      </figure>
    )
  if (b.tipo === 'citacao' && b.texto)
    return (
      <blockquote className="mt-10 rounded-2xl border-l-4 border-cyan-400 bg-white p-6 shadow-soft sm:p-8">
        <Quote className="h-7 w-7 text-cyan-500" />
        <p className="mt-3 font-display text-xl font-bold leading-relaxed text-navy-900">“{b.texto}”</p>
        {b.autor && <footer className="mt-3 text-sm font-semibold uppercase tracking-wide text-cyan-700">{b.autor}</footer>}
      </blockquote>
    )
  if (b.tipo === 'botao' && b.rotulo && b.url) {
    const externo = /^https?:\/\//.test(b.url)
    const cls = 'btn-primary mt-10'
    return (
      <div className="text-center">
        {externo ? (
          <a href={b.url} target="_blank" rel="noopener noreferrer" className={cls}>
            {b.rotulo}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <Link to={b.url} className={cls}>
            {b.rotulo}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    )
  }
  return null
}

export default function NovidadePage() {
  const { id } = useParams()
  const { novidades } = useStore()
  const n = novidades.find((x) => String(x.id) === id)
  const [foto, setFoto] = useState(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (n) document.title = `${n.titulo} · APHAM`
  }, [n])

  if (!n) {
    return (
      <PageShell eyebrow="Novidades" titulo="Notícia não encontrada">
        <section className="section-pad py-16 lg:py-20">
          <div className="container-x text-center text-navy-500">
            <p>Esta notícia não existe ou foi removida.</p>
            <Link to="/#novidades" className="btn-primary mt-6 inline-flex">
              <ArrowLeft className="h-4 w-4" />
              Ver todas as notícias
            </Link>
          </div>
        </section>
      </PageShell>
    )
  }

  const outras = [...novidades]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .filter((x) => x !== n)
    .slice(0, 3)
  const blocos = n.blocos || []
  // Todas as fotos da página, para navegar na tela cheia.
  const extras = (n.imgs || []).filter((s) => s && s !== n.img)
  const fotos = [
    n.img,
    ...extras,
    ...blocos.flatMap((b) => (b.tipo === 'imagem' ? [b.img] : b.tipo === 'galeria' ? b.imgs || [] : [])),
  ].filter(Boolean)
  const abrirFoto = (src) => setFoto(Math.max(0, fotos.indexOf(src)))

  const url = `${site.url}/novidades/${encodeURIComponent(n.id)}`
  const compartilharWhats = `https://wa.me/?text=${encodeURIComponent(`${n.titulo} — ${url}`)}`
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* sem permissão: ignora */
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Capa */}
      <header className="relative overflow-hidden bg-navy-950 pb-16 pt-32 lg:pb-20 lg:pt-40">
        {n.img && <img src={n.img} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45 blur-[2px]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/40" />
        <div className="section-pad container-x relative max-w-4xl text-center">
          <Link to="/#novidades" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            APHAM News
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {n.tag && <span className="rounded-full bg-cyan-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">{n.tag}</span>}
            {n.data && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/85 ring-1 ring-white/15">
                <CalendarDays className="h-3.5 w-3.5" />
                {n.data}
              </span>
            )}
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">{n.titulo}</h1>
          {n.resumo && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{n.resumo}</p>}
        </div>
      </header>

      <main>
        <article className="section-pad pb-16 lg:pb-20">
          <div className="container-x max-w-3xl">
            {n.img && (
              <Reveal>
                <button type="button" onClick={() => abrirFoto(n.img)} className="-mt-8 block w-full overflow-hidden rounded-3xl shadow-lift ring-4 ring-paper lg:-mt-10">
                  <img src={n.img} alt={n.titulo} className="max-h-[32rem] w-full object-cover" />
                </button>
              </Reveal>
            )}

            <div className={n.img ? 'mt-10' : 'mt-12'}>
              {paragrafos(n.texto).map((p, i) => (
                <p key={i} className={`whitespace-pre-line leading-relaxed text-ink/80 ${i === 0 ? 'text-lg font-medium text-navy-900 sm:text-xl' : 'mt-5 text-base sm:text-lg'}`}>
                  {p}
                </p>
              ))}
            </div>

            {extras.length > 0 && <Bloco b={{ tipo: 'galeria', imgs: extras }} abrirFoto={abrirFoto} />}
            {blocos.map((b, i) => (
              <Bloco key={i} b={b} abrirFoto={abrirFoto} />
            ))}

            {/* Compartilhar */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-3 border-t border-navy-100 pt-8">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600">
                <Share2 className="h-4 w-4" />
                Compartilhar:
              </span>
              <a href={compartilharWhats} target="_blank" rel="noopener noreferrer" className="btn bg-[#25d366] text-white hover:bg-[#1ebe5b]">
                WhatsApp
              </a>
              <button type="button" onClick={copiar} className="btn border border-navy-200 bg-white text-navy-800 hover:bg-navy-50">
                <Link2 className="h-4 w-4" />
                {copiado ? 'Link copiado!' : 'Copiar link'}
              </button>
            </div>
          </div>
        </article>

        {outras.length > 0 && (
          <section className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
            <div className="container-x">
              <h2 className="text-center font-display text-2xl font-extrabold text-navy-900">Outras notícias</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {outras.map((o) => (
                  <Link
                    key={o.id}
                    to={`/novidades/${encodeURIComponent(o.id)}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift transition-all duration-300 hover:-translate-y-1"
                  >
                    {o.img && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={o.img} alt={o.titulo} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        {o.tag && <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">{o.tag}</span>}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-bold text-navy-900">{o.titulo}</h3>
                      <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-cyan-700">
                        Ler notícia <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />
      <Lightbox fotos={fotos} idx={foto} setIdx={setFoto} />
    </div>
  )
}
