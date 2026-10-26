import {
  FileText,
  CalendarDays,
  HeartHandshake,
  Users,
  Award,
  BookOpen,
  Target,
  Sprout,
  Briefcase,
  Globe2,
  Lightbulb,
  Scale,
  Quote,
  Film,
  Flower2,
  School,
  ArrowUpRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from './PageShell'
import Reveal from './Reveal'

// Layout das páginas montadas a partir de um folder/documento (Marajó Solidário,
// Documentário, Cooperativa, Reconhecimentos…). O conteúdo de cada página fica em
// src/data/folders.js; aqui só o visual. Também usado nos projetos (sem folder). Ordem: apresentação + números, `extra`
// (opcional), blocos, citação, folder/documento, ficha técnica e `depois` (opcional).

const ICONES = {
  heart: HeartHandshake,
  award: Award,
  book: BookOpen,
  target: Target,
  sprout: Sprout,
  briefcase: Briefcase,
  globe: Globe2,
  idea: Lightbulb,
  scale: Scale,
  film: Film,
  users: Users,
  school: School,
}

function Titulo({ children, className = '' }) {
  return <h2 className={`font-display text-2xl font-extrabold text-navy-900 sm:text-3xl ${className}`}>{children}</h2>
}

function Paragrafos({ itens, className = 'mt-4' }) {
  return [].concat(itens || []).map((p, i) => (
    <p key={i} className={`${className} leading-relaxed text-ink/75`}>
      {p}
    </p>
  ))
}

function Lista({ itens }) {
  if (!itens?.length) return null
  return (
    <ul className="mt-4 space-y-2">
      {itens.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
          {t}
        </li>
      ))}
    </ul>
  )
}

function Caixas({ itens }) {
  if (!itens?.length) return null
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {itens.map((c) => (
        <div key={c.rotulo} className="rounded-2xl border border-navy-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{c.rotulo}</p>
          <p className="mt-2 text-sm text-navy-800">{c.texto}</p>
        </div>
      ))}
    </div>
  )
}

function Datas({ titulo, itens }) {
  return (
    <>
      {titulo && (
        <Reveal>
          <h3 className="mt-14 font-display text-xl font-extrabold text-navy-900">{titulo}</h3>
        </Reveal>
      )}
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${titulo ? 'mt-5' : 'mt-8'}`}>
        {itens.map((p, i) => (
          <Reveal key={i} delay={0.06 * i}>
            <div className="flex h-full gap-4 rounded-2xl bg-navy-50 p-5">
              <CalendarDays className="h-6 w-6 shrink-0 text-cyan-600" />
              <div>
                <p className="font-semibold text-navy-900">{p.titulo}</p>
                <p className="mt-1 text-sm text-ink/70">{p.texto}</p>
                {p.detalhe && <p className="mt-1 text-sm text-ink/60">{p.detalhe}</p>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  )
}

function Bloco({ b }) {
  if (b.tipo === 'colunas') {
    return (
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2">
        {b.colunas.map((c, i) => (
          <Reveal key={i} delay={0.08 * i}>
            <Titulo>{c.titulo}</Titulo>
            <Paragrafos itens={c.paragrafos} />
            <Lista itens={c.lista} />
            <Caixas itens={c.caixas} />
          </Reveal>
        ))}
      </div>
    )
  }

  if (b.tipo === 'texto') {
    return (
      <div className="container-x max-w-3xl">
        <Reveal>
          <Titulo>{b.titulo}</Titulo>
          <Paragrafos itens={b.paragrafos} />
          <Lista itens={b.lista} />
        </Reveal>
      </div>
    )
  }

  if (b.tipo === 'cards') {
    const Ic = ICONES[b.icone] || HeartHandshake
    const cols = b.itens.length % 3 === 0 || b.itens.length > 4 ? 'md:grid-cols-3' : b.itens.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'
    return (
      <div className="container-x">
        <Reveal>
          <Titulo>{b.titulo}</Titulo>
          {b.intro && <p className="mt-3 max-w-3xl leading-relaxed text-ink/70">{b.intro}</p>}
        </Reveal>
        <div className={`mt-8 grid grid-cols-1 gap-5 ${cols}`}>
          {b.itens.map((d, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                <Ic className="h-7 w-7 text-cyan-500" />
                <p className="mt-3 font-display text-xl font-extrabold text-navy-900">{d.titulo}</p>
                {d.texto && <p className="mt-2 text-sm leading-relaxed text-ink/75">{d.texto}</p>}
                <Lista itens={d.lista} />
              </div>
            </Reveal>
          ))}
        </div>
        {b.datas && <Datas {...b.datas} />}
      </div>
    )
  }

  if (b.tipo === 'datas') {
    return (
      <div className="container-x">
        <Reveal>
          <Titulo>{b.titulo}</Titulo>
        </Reveal>
        <Datas itens={b.itens} />
      </div>
    )
  }

  if (b.tipo === 'artigos') {
    return (
      <div className="container-x max-w-3xl">
        <Reveal>
          <Titulo>{b.titulo}</Titulo>
          {b.ementa && (
            <p className="mt-4 border-l-4 border-cyan-400 pl-4 italic leading-relaxed text-navy-800">{b.ementa}</p>
          )}
        </Reveal>
        <div className="mt-8 space-y-4">
          {b.itens.map((a, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-5">
                <Scale className="h-5 w-5 shrink-0 text-cyan-600" />
                <p className="text-sm leading-relaxed text-ink/80">
                  <span className="font-bold text-navy-900">{a.rotulo} </span>
                  {a.texto}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    )
  }

  // Dados em destaque (ex.: conta bancária para doações), em blocos escuros.
  if (b.tipo === 'dados') {
    return (
      <div className="container-x max-w-4xl text-center">
        <Reveal>
          <Titulo>{b.titulo}</Titulo>
          {b.intro && <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink/70">{b.intro}</p>}
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-3xl bg-navy-950 p-6 text-left shadow-lift sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {b.itens.map((d) => (
              <div key={d.rotulo} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">{d.rotulo}</p>
                <p className="mt-1 select-all font-display text-xl font-extrabold text-white">{d.valor}</p>
              </div>
            ))}
          </div>
        </Reveal>
        {b.nota && <p className="mx-auto mt-4 max-w-2xl text-sm text-ink/60">{b.nota}</p>}
      </div>
    )
  }

  if (b.tipo === 'imagem') {
    return (
      <div className="container-x max-w-4xl">
        <Reveal>
          {b.titulo && <Titulo className="mb-6 text-center">{b.titulo}</Titulo>}
          <figure className="overflow-hidden rounded-2xl bg-white shadow-lift">
            <img src={b.src} alt={b.legenda || ''} loading="lazy" className="w-full object-cover" />
            {b.legenda && <figcaption className="px-5 py-4 text-center text-sm text-ink/70">{b.legenda}</figcaption>}
          </figure>
        </Reveal>
      </div>
    )
  }

  // Destaque com imagem + texto + link (ex.: o prêmio que o projeto recebeu).
  if (b.tipo === 'destaque') {
    return (
      <div className="container-x max-w-5xl">
        <Reveal>
          <div
            className={`grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border border-navy-100 bg-white p-6 shadow-lift sm:p-8 ${
              b.fotos ? 'md:grid-cols-[320px_1fr]' : 'md:grid-cols-[220px_1fr]'
            }`}
          >
            {b.fotos ? (
              <div className="grid h-64 grid-cols-2 grid-rows-2 gap-2">
                {b.fotos.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" className="h-full w-full rounded-xl object-cover" />
                ))}
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-2xl bg-navy-50 p-4">
                <img src={b.img} alt={b.titulo} loading="lazy" className="max-h-full w-auto object-contain" />
              </div>
            )}
            <div className="text-center md:text-left">
              {b.rotulo && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">{b.rotulo}</p>}
              <h3 className="mt-2 font-display text-2xl font-extrabold text-navy-900">{b.titulo}</h3>
              <Paragrafos itens={b.paragrafos} className="mt-3" />
              {b.link && (
                <Link to={b.link.to} className="btn-primary mt-6">
                  {b.link.rotulo}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    )
  }

  if (b.tipo === 'memoria') {
    return (
      <div className="container-x max-w-3xl text-center">
        <Reveal>
          <Flower2 className="mx-auto h-8 w-8 text-cyan-500" />
          <Titulo className="mt-3">{b.titulo}</Titulo>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {b.nomes.map((n) => (
              <span key={n} className="rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm font-semibold text-navy-800">
                {n}
              </span>
            ))}
          </div>
          <Paragrafos itens={b.paragrafos} className="mt-6" />
        </Reveal>
      </div>
    )
  }

  return null
}

function Secao({ alt, children }) {
  return (
    <section className={`section-pad border-t border-navy-100 py-16 lg:py-20 ${alt ? 'bg-white' : ''}`}>{children}</section>
  )
}

// Abre o PDF só para ver, escondendo a barra do leitor (onde fica o "baixar")
// nos navegadores que aceitam esse ajuste (Chrome, Edge).
const verPdf = (url) => (url && !url.includes('#') ? `${url}#toolbar=0&navpanes=0` : url)

export default function FolderPage({ dados: d, extra, depois }) {
  const blocos = d.blocos || []
  const numCols = d.numeros?.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  const rotuloDoc = d.rotuloDoc || 'Ver o folder'
  const tituloPaginas = d.tituloPaginas || 'Folder'
  // A seção do folder alterna o fundo com o último bloco.
  const altFinal = blocos.length % 2 === 0

  return (
    <PageShell eyebrow={d.eyebrow} titulo={d.titulo} descricao={d.descricao}>
      {/* Apresentação + números */}
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div
              className={`overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift ${
                d.capa.cheia ? '' : 'p-6 sm:p-10'
              }`}
            >
              <img
                src={d.capa.img}
                alt={d.capa.alt}
                className={d.capa.cheia ? 'max-h-[28rem] w-full object-cover object-center' : 'mx-auto max-h-80 w-auto max-w-full object-contain'}
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {d.lema && (
              <span className="eyebrow flex justify-center">
                <span className="h-px w-6 bg-cyan-400" />
                {d.lema}
                <span className="h-px w-6 bg-cyan-400" />
              </span>
            )}
            <Paragrafos itens={d.resumo} className="mt-4 text-lg" />
            {(d.doc || d.links?.length > 0) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {d.links?.map((l) => (
                  <Link key={l.to} to={l.to} className="btn-primary">
                    {l.rotulo}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ))}
                {d.doc && (
                  <>
                    <a href={verPdf(d.doc)} target="_blank" rel="noopener noreferrer" className="btn-accent">
                      <FileText className="h-4 w-4" />
                      {rotuloDoc}
                    </a>
                  </>
                )}
              </div>
            )}
          </Reveal>
        </div>

        {d.numeros?.length > 0 && (
          <div className={`container-x mt-14 grid grid-cols-2 gap-4 ${numCols}`}>
            {d.numeros.map((n, i) => (
              <Reveal
                key={n.label}
                delay={0.06 * i}
                // Quantidade ímpar: no celular o último ocupa a linha inteira.
                className={d.numeros.length % 2 && i === d.numeros.length - 1 ? 'col-span-2 lg:col-span-1' : ''}
              >
                <div className="h-full rounded-2xl bg-navy-900 px-3 py-6 text-center shadow-lift sm:px-6">
                  <p className="font-display text-xl font-extrabold leading-tight text-cyan-400 min-[400px]:text-2xl sm:text-3xl lg:text-4xl">{n.valor}</p>
                  <p className="mt-2 text-sm text-white/75">{n.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {extra}

      {blocos.map((b, i) => (
        <Secao key={i} alt={i % 2 === 0}>
          <Bloco b={b} />
        </Secao>
      ))}

      {/* Citação do folder */}
      {d.citacao && (
        <section className="section-pad relative overflow-hidden bg-navy-950 py-16 lg:py-20">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <Reveal className="container-x relative max-w-3xl text-center">
            <Quote className="mx-auto h-9 w-9 text-cyan-400" />
            <p className="mt-5 font-display text-xl font-bold leading-relaxed text-white sm:text-2xl">“{d.citacao.texto}”</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{d.citacao.autor}</p>
          </Reveal>
        </section>
      )}

      {/* Folder / documento */}
      {(d.paginas?.length > 0 || d.ficha?.length > 0) && (
        <section className={`section-pad border-t border-navy-100 py-16 lg:py-20 ${altFinal ? 'bg-white' : ''}`}>
          <div className="container-x">
            {d.paginas?.length > 0 && (
              <>
                <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Titulo>{tituloPaginas}</Titulo>
                    <p className="mt-2 text-ink/70">Clique nas páginas para abrir o documento completo em PDF.</p>
                  </div>
                  {d.doc && (
                    <a href={verPdf(d.doc)} target="_blank" rel="noopener noreferrer" className="btn-accent w-fit">
                      <FileText className="h-4 w-4" />
                      Abrir PDF
                    </a>
                  )}
                </Reveal>
                <div
                  className={`mt-8 grid grid-cols-1 gap-6 ${
                    d.paginas.length > 1 ? 'lg:grid-cols-2' : 'mx-auto max-w-2xl'
                  }`}
                >
                  {d.paginas.map((src, i) => (
                    <Reveal key={src} delay={0.06 * i}>
                      <a
                        href={verPdf(d.doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift transition-transform duration-300 hover:-translate-y-1"
                      >
                        <img src={src} alt={`${d.titulo} — página ${i + 1}`} loading="lazy" className="w-full" />
                      </a>
                    </Reveal>
                  ))}
                </div>
              </>
            )}

            {d.outrosDocs?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {d.outrosDocs.map((o) => (
                  <a
                    key={o.href}
                    href={verPdf(o.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border border-navy-200 bg-white text-navy-800 hover:bg-navy-50"
                  >
                    <FileText className="h-4 w-4" />
                    {o.titulo}
                  </a>
                ))}
              </div>
            )}

            {d.ficha?.length > 0 && (
              <>
                <Reveal>
                  <h3 className={`flex items-center gap-2 font-display text-xl font-extrabold text-navy-900 ${d.paginas?.length ? 'mt-14' : ''}`}>
                    <Users className="h-5 w-5 text-cyan-600" />
                    {d.tituloFicha || 'Ficha técnica'}
                  </h3>
                </Reveal>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {d.ficha.map((f) => (
                    <div key={f.cargo + (f.nome || f.nomes?.join())} className="rounded-2xl border border-navy-100 bg-white p-5">
                      {f.nome && <p className="font-semibold text-navy-900">{f.nome}</p>}
                      {f.nomes?.map((n) => (
                        <p key={n} className="font-semibold text-navy-900">{n}</p>
                      ))}
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">{f.cargo}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {depois}
    </PageShell>
  )
}
