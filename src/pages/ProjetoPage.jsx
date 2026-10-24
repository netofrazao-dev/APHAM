import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import FolderPage from '../components/FolderPage'
import PageShell from '../components/PageShell'
import { projetos } from '../data/content'
import { projetosDetalhes } from '../data/folders'

// Página de um projeto (/projetos/:slug), no mesmo estilo das páginas dos folders.
export default function ProjetoPage() {
  const { slug } = useParams()
  const dados = projetosDetalhes[slug]
  const outros = projetos.lista.filter((p) => p.slug && p.slug !== slug)

  useEffect(() => {
    if (dados) document.title = `${dados.titulo} · Projetos · APHAM`
  }, [dados])

  if (!dados) {
    return (
      <PageShell eyebrow="Projetos" titulo="Projeto não encontrado">
        <section className="section-pad py-16 text-center">
          <Link to="/projetos" className="btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Ver todos os projetos
          </Link>
        </section>
      </PageShell>
    )
  }

  const navegacao = (
    <section className="section-pad border-t border-navy-100 py-16 lg:py-20">
      <div className="container-x">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-extrabold text-navy-900">Conheça também</h2>
          <Link to="/projetos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-800">
            <ArrowLeft className="h-4 w-4" />
            Todos os projetos
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {outros.map((p) => (
            <Link
              key={p.slug}
              to={`/projetos/${p.slug}`}
              className="group flex items-center gap-5 rounded-2xl border border-navy-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-50 p-1.5">
                <img src={p.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-bold text-navy-900">{p.nome}</span>
                <span className="mt-1 block text-sm text-ink/70">{p.resumo}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-cyan-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )

  return <FolderPage dados={dados} depois={navegacao} />
}
