import { FileText, Download, CalendarDays, HeartHandshake, Users } from 'lucide-react'
import PageShell from '../components/PageShell'
import Reveal from '../components/Reveal'
import { marajoSolidario as ms } from '../data/content'

export default function MarajoSolidarioPage() {
  return (
    <PageShell
      eyebrow="Ação social"
      titulo="Marajó Solidário"
      descricao="A maior ação de distribuição de alimentos do Marajó durante a pandemia de COVID-19."
    >
      {/* Apresentação + números */}
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-lift sm:p-10">
              <img src={ms.logo} alt="Marajó Solidário — Em favor de todos que necessitam!" className="mx-auto w-full max-w-md" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="eyebrow">
              <span className="h-px w-6 bg-cyan-400" />
              {ms.lema}
            </span>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{ms.resumo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={ms.folder} target="_blank" rel="noopener noreferrer" className="btn-accent">
                <FileText className="h-4 w-4" />
                Ver o folder da ação
              </a>
              <a href={ms.folder} download className="btn border border-navy-200 bg-white text-navy-800 hover:bg-navy-50">
                <Download className="h-4 w-4" />
                Baixar PDF
              </a>
            </div>
          </Reveal>
        </div>

        <div className="container-x mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ms.numeros.map((n, i) => (
            <Reveal key={n.label} delay={0.06 * i}>
              <div className="h-full rounded-2xl bg-navy-900 p-6 text-center shadow-lift">
                <p className="font-display text-3xl font-extrabold text-cyan-400 sm:text-4xl">{n.valor}</p>
                <p className="mt-2 text-sm text-white/75">{n.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Como aconteceu + objetivo */}
      <section className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Como a ação aconteceu</h2>
            {ms.historia.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-ink/75">{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Objetivo</h2>
            <p className="mt-4 leading-relaxed text-ink/75">{ms.objetivo}</p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Promoção</p>
                <p className="mt-2 text-sm text-navy-800">{ms.parceiros.promocao.join(' · ')}</p>
              </div>
              <div className="rounded-2xl border border-navy-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Apoio</p>
                <p className="mt-2 text-sm text-navy-800">{ms.parceiros.apoio.join(' · ')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Distribuição + período */}
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Como os alimentos foram distribuídos</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {ms.distribuicao.map((d, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                  <HeartHandshake className="h-7 w-7 text-cyan-500" />
                  <p className="mt-3 font-display text-xl font-extrabold text-navy-900">{d.valor}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{d.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h3 className="mt-14 font-display text-xl font-extrabold text-navy-900">Período de distribuição</h3>
          </Reveal>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ms.periodo.map((p, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <div className="flex h-full gap-4 rounded-2xl bg-navy-50 p-5">
                  <CalendarDays className="h-6 w-6 shrink-0 text-cyan-600" />
                  <div>
                    <p className="font-semibold text-navy-900">{p.quem}</p>
                    <p className="mt-1 text-sm text-ink/70">{p.quando}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Folder da ação */}
      <section className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
        <div className="container-x">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Folder da ação</h2>
              <p className="mt-2 text-ink/70">Clique nas páginas para abrir o folder completo em PDF.</p>
            </div>
            <a href={ms.folder} target="_blank" rel="noopener noreferrer" className="btn-accent w-fit">
              <FileText className="h-4 w-4" />
              Abrir folder (PDF)
            </a>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ms.paginasFolder.map((src, i) => (
              <Reveal key={src} delay={0.06 * i}>
                <a
                  href={ms.folder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-2xl border border-navy-100 shadow-lift transition-transform duration-300 hover:-translate-y-1"
                >
                  <img src={src} alt={`Folder Marajó Solidário — página ${i + 1}`} loading="lazy" className="w-full" />
                </a>
              </Reveal>
            ))}
          </div>

          {/* Ficha técnica */}
          <Reveal>
            <h3 className="mt-14 flex items-center gap-2 font-display text-xl font-extrabold text-navy-900">
              <Users className="h-5 w-5 text-cyan-600" />
              Ficha técnica
            </h3>
          </Reveal>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ms.ficha.map((f) => (
              <div key={f.nome} className="rounded-2xl border border-navy-100 p-5">
                <p className="font-semibold text-navy-900">{f.nome}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">{f.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
