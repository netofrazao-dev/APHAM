import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import FolderPage from '../components/FolderPage'
import PageShell from '../components/PageShell'
import { reconhecimentos } from '../data/content'
import { reconhecimentosDetalhes } from '../data/folders'

// Página de um prêmio/certificação (/reconhecimentos/:slug).
export default function ReconhecimentoPage() {
  const { slug } = useParams()
  const dados = reconhecimentosDetalhes[slug]
  const outros = reconhecimentos.filter((r) => r.slug && r.slug !== slug)

  useEffect(() => {
    if (dados) document.title = `${dados.titulo} · APHAM`
  }, [dados])

  if (!dados) {
    return (
      <PageShell eyebrow="Credenciais" titulo="Reconhecimento não encontrado">
        <section className="section-pad py-16 text-center">
          <Link to="/reconhecimentos" className="btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Ver todos os reconhecimentos
          </Link>
        </section>
      </PageShell>
    )
  }

  const navegacao = (
    <section className="section-pad border-t border-navy-100 py-16 lg:py-20">
      <div className="container-x">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-extrabold text-navy-900">Outros reconhecimentos</h2>
          <Link to="/reconhecimentos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-800">
            <ArrowLeft className="h-4 w-4" />
            Ver todos
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outros.map((r) => (
            <Link
              key={r.slug}
              to={`/reconhecimentos/${r.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy-50 p-2">
                <img src={r.img} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="flex-1 text-sm font-bold leading-snug text-navy-900">{r.titulo}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )

  return <FolderPage dados={dados} depois={navegacao} />
}
