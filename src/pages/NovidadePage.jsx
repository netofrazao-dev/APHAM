import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import PageShell from '../components/PageShell'
import Reveal from '../components/Reveal'
import { useStore } from '../store/StoreContext'

// Subpágina de uma novidade (aberta ao clicar no card "Novidades" do topo da home).
export default function NovidadePage() {
  const { id } = useParams()
  const { novidades } = useStore()
  const n = novidades.find((x) => String(x.id) === id)
  const outras = [...novidades]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .filter((x) => x !== n)
    .slice(0, 3)

  useEffect(() => {
    if (n) document.title = `${n.titulo} · APHAM`
  }, [n])

  if (!n) {
    return (
      <PageShell eyebrow="Novidades" titulo="Novidade não encontrada">
        <section className="section-pad py-16 lg:py-20">
          <div className="container-x text-center text-navy-500">
            <p>Esta novidade não existe ou foi removida.</p>
            <Link to="/#novidades" className="btn-primary mt-6 inline-flex">
              <ArrowLeft className="h-4 w-4" />
              Ver todas as novidades
            </Link>
          </div>
        </section>
      </PageShell>
    )
  }

  return (
    <PageShell eyebrow={n.tag || 'Novidades'} titulo={n.titulo} descricao={n.data || undefined}>
      <section className="section-pad py-12 lg:py-16">
        <div className="container-x max-w-3xl">
          <Link
            to="/#novidades"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para as novidades
          </Link>

          {n.img && (
            <Reveal>
              <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl shadow-lift">
                <img src={n.img} alt={n.titulo} className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}

          <Reveal>
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink/80 sm:text-lg">{n.texto}</p>
          </Reveal>

          {Array.isArray(n.imgs) && n.imgs.filter((src) => src !== n.img).length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {n.imgs
                .filter((src) => src !== n.img)
                .map((src) => (
                  <img key={src} src={src} alt={n.titulo} loading="lazy" className="w-full rounded-2xl object-cover shadow-soft" />
                ))}
            </div>
          )}
        </div>
      </section>

      {outras.length > 0 && (
        <section className="section-pad border-t border-navy-100 py-12 lg:py-16">
          <div className="container-x">
            <h2 className="font-display text-2xl font-extrabold text-navy-900">Outras novidades</h2>
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
                      {o.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">{o.tag}</span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-navy-900">{o.titulo}</h3>
                    <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-cyan-700">
                      Ler novidade <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  )
}
