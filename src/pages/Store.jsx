import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, ShoppingBag, Store as StoreIcon, ArrowUpRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { precoVitrine, urlLoja } from '../store/lojas'
import { lojaConceito, assinaturaSocialPlay, site } from '../data/content'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductCard from '../components/store/ProductCard'

export default function Store() {
  const { produtosVitrine: produtos, categorias, settings, recentes, comissao, lojasAprovadas, isAdmin, minhaLoja } = useStore()
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState('todas')
  const [lojaSel, setLojaSel] = useState('todas') // 'todas' | 'apham' | id da loja
  const [ordem, setOrdem] = useState('destaque')

  const lista = useMemo(() => {
    let l = produtos
    if (cat !== 'todas') l = l.filter((p) => p.categoria === cat)
    if (lojaSel === 'apham') l = l.filter((p) => !p.lojaId)
    else if (lojaSel !== 'todas') l = l.filter((p) => p.lojaId === lojaSel)
    if (busca.trim()) {
      const q = busca.toLowerCase()
      l = l.filter((p) => p.nome.toLowerCase().includes(q) || (p.descricao || '').toLowerCase().includes(q))
    }
    l = [...l]
    if (ordem === 'menor') l.sort((a, b) => precoVitrine(a, comissao) - precoVitrine(b, comissao))
    else if (ordem === 'maior') l.sort((a, b) => precoVitrine(b, comissao) - precoVitrine(a, comissao))
    else if (ordem === 'nome') l.sort((a, b) => a.nome.localeCompare(b.nome))
    else l.sort((a, b) => (b.destaque === true) - (a.destaque === true))
    return l
  }, [produtos, cat, busca, ordem, lojaSel, comissao])

  const lojaFechada = settings.lojaAtiva === false

  // Loja pausada (em preparação) — mostra "em breve" em vez do catálogo. Admin e
  // lojistas logados continuam vendo a loja, para montar tudo antes de abrir.
  if (site.lojaPausada && !isAdmin && !minhaLoja) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <section className="section-pad flex flex-1 items-center justify-center py-24">
          <div className="container-x max-w-lg text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">
              Loja em breve
            </h1>
            <p className="mt-4 text-ink/70">
              Estamos preparando a loja oficial da APHAM. Volte logo para vestir a camisa do handebol
              do Marajó!
            </p>
            <Link to="/" className="btn-primary mt-8">
              Voltar ao início
            </Link>
          </div>
        </section>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />

      {/* Banner — só a assinatura da Social Play no fundo */}
      <section className="relative overflow-hidden bg-navy-950">
        <img
          src={assinaturaSocialPlay}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-3%] top-1/2 w-[56%] max-w-xl -translate-y-1/2 select-none opacity-25"
        />
        {/* Degradê leve só para a leitura do texto à esquerda */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 to-transparent" />
        <div className="container-x section-pad relative py-14 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-navy-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            <ShoppingBag className="h-3.5 w-3.5 text-cyan-400" />
            {lojaConceito.marca}
          </span>
          <h1 className="mt-5 max-w-2xl font-akbar text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            {lojaConceito.conceito}
          </h1>
          <p className="mt-4 max-w-xl text-white/80">{settings.descricao || lojaConceito.descricao}</p>
        </div>
      </section>

      {site.lojaPausada && (
        <div className="bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
          Prévia: a loja ainda não está aberta ao público. Só o admin e os lojistas logados veem esta página.
        </div>
      )}

      {lojaFechada && (
        <div className="bg-cyan-50 px-4 py-3 text-center text-sm font-medium text-cyan-800">
          A loja está temporariamente fechada para novos pedidos. Volte em breve!
        </div>
      )}

      {/* Controles */}
      <section className="section-pad border-b border-navy-100 bg-white py-5">
        <div className="container-x flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full rounded-full border border-navy-200 bg-paper py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-navy-500" />
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className="rounded-full border border-navy-200 bg-white py-2.5 pl-3 pr-8 text-sm text-navy-800 outline-none focus:border-cyan-500"
            >
              <option value="destaque">Destaques</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
              <option value="nome">Nome (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Lojas (APHAM + parceiras) */}
        {lojasAprovadas.length > 0 && (
          <div className="container-x mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">
              <StoreIcon className="h-3.5 w-3.5" />
              Vendido por
            </span>
            {[{ id: 'todas', nome: 'Todas as lojas' }, { id: 'apham', nome: 'APHAM' }, ...lojasAprovadas].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLojaSel(l.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  lojaSel === l.id ? 'bg-cyan-500 text-white' : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                {l.nome}
              </button>
            ))}
          </div>
        )}

        {/* Categorias */}
        <div className="container-x mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat('todas')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === 'todas' ? 'bg-navy-800 text-white' : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
            }`}
          >
            Todas
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat === c.id ? 'bg-navy-800 text-white' : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      </section>

      {/* Grade */}
      <section className="section-pad flex-1 py-10">
        <div className="container-x">
          {lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-200 py-20 text-center text-navy-500">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {lista.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lojas parceiras */}
      <section className="section-pad border-t border-navy-100 bg-white py-12">
        <div className="container-x">
          {lojasAprovadas.length > 0 && (
            <>
              <h2 className="text-center font-display text-2xl font-extrabold text-navy-900">Lojas parceiras</h2>
              <p className="mt-2 text-center text-ink/70">Lojas que vendem com a APHAM — cada compra também apoia o handebol do Marajó.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {lojasAprovadas.map((l) => (
                  <Link key={l.id} to={urlLoja(l)} className="group flex items-center gap-3 rounded-2xl border border-navy-100 bg-paper p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-100 font-display font-extrabold text-navy-700">
                      {l.logo ? <img src={l.logo} alt="" className="h-full w-full object-cover" /> : l.nome.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-display text-sm font-bold text-navy-900">{l.nome}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-600" />
                  </Link>
                ))}
              </div>
            </>
          )}
          <div className={`flex flex-col items-center gap-3 rounded-2xl bg-navy-950 p-6 text-center sm:flex-row sm:justify-between sm:text-left ${lojasAprovadas.length ? 'mt-8' : ''}`}>
            <div>
              <p className="font-display text-lg font-extrabold text-white">Tem uma loja? Venda aqui com a gente.</p>
              <p className="text-sm text-white/70">Abra a sua lojinha dentro da loja da APHAM.</p>
            </div>
            <Link to="/vender" className="btn-accent shrink-0">
              Quero vender
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vistos recentemente */}
      {(() => {
        const vistos = recentes
          .map((id) => produtos.find((p) => p.id === id))
          .filter(Boolean)
          .slice(0, 4)
        if (vistos.length === 0) return null
        return (
          <section className="section-pad border-t border-navy-100 py-10">
            <div className="container-x">
              <h2 className="mb-6 font-display text-xl font-bold text-navy-900">Vistos recentemente</h2>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                {vistos.map((p) => (
                  <ProductCard key={p.id} produto={p} />
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      <StoreFooter />
    </div>
  )
}
