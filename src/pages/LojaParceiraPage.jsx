import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Instagram, MapPin, ShieldCheck, Store as StoreIcon } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { site } from '../data/content'
import { slugLoja } from '../store/lojas'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductCard from '../components/store/ProductCard'

// Página de uma loja parceira dentro da loja da APHAM (/loja/lojas/:slug).
export default function LojaParceiraPage() {
  const { slug } = useParams()
  const { lojasAprovadas, produtosVitrine, isAdmin, minhaLoja } = useStore()
  const loja = lojasAprovadas.find((l) => (l.slug || slugLoja(l.nome)) === slug)
  const produtos = loja ? produtosVitrine.filter((p) => p.lojaId === loja.id) : []
  const pausada = site.lojaPausada && !isAdmin && !minhaLoja

  useEffect(() => {
    if (loja) document.title = `${loja.nome} · Loja APHAM`
  }, [loja])

  if (!loja || pausada) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <div className="section-pad container-x flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <StoreIcon className="h-10 w-10 text-cyan-600" />
          <p className="text-navy-600">{pausada ? 'A loja da APHAM abre em breve.' : 'Loja não encontrada.'}</p>
          <Link to="/loja" className="btn-accent">Ir para a loja</Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  const insta = (loja.instagram || '').replace(/^@/, '').trim()

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />

      {/* Capa */}
      <section className="relative h-48 overflow-hidden bg-navy-950 sm:h-64">
        {loja.capa ? (
          <img src={loja.capa} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-navy-900 to-navy-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
      </section>

      {/* Cabeçalho da loja */}
      <section className="section-pad">
        <div className="container-x relative -mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white font-display text-4xl font-extrabold text-violet-700 shadow-lift ring-4 ring-paper sm:h-32 sm:w-32">
            {loja.logo ? <img src={loja.logo} alt={loja.nome} className="h-full w-full object-cover" /> : loja.nome.slice(0, 1)}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Loja parceira da APHAM</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">{loja.nome}</h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-navy-600">
              {loja.cidade && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-cyan-600" />
                  {loja.cidade}
                </span>
              )}
              {insta && (
                <a href={`https://instagram.com/${insta}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-700">
                  <Instagram className="h-4 w-4 text-cyan-600" />@{insta}
                </a>
              )}
            </div>
            {loja.descricao && <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/75">{loja.descricao}</p>}
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Pagamento seguro e atendimento pela APHAM
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section className="section-pad flex-1 py-10">
        <div className="container-x">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-navy-900">Produtos ({produtos.length})</h2>
            <Link to="/loja" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-800">
              <ArrowLeft className="h-4 w-4" />
              Toda a loja
            </Link>
          </div>
          {produtos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-200 py-16 text-center text-navy-500">Esta loja ainda não tem produtos à venda.</div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {produtos.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <StoreFooter />
    </div>
  )
}
