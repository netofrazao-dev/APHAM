import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { precoFinal } from '../store/format'
import { lojaConceito, assinaturaSocialPlay } from '../data/content'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductCard from '../components/store/ProductCard'

export default function Store() {
  const { produtos, categorias, settings, recentes } = useStore()
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState('todas')
  const [ordem, setOrdem] = useState('destaque')

  const lista = useMemo(() => {
    let l = produtos.filter((p) => p.ativo !== false)
    if (cat !== 'todas') l = l.filter((p) => p.categoria === cat)
    if (busca.trim()) {
      const q = busca.toLowerCase()
      l = l.filter((p) => p.nome.toLowerCase().includes(q) || (p.descricao || '').toLowerCase().includes(q))
    }
    l = [...l]
    if (ordem === 'menor') l.sort((a, b) => precoFinal(a) - precoFinal(b))
    else if (ordem === 'maior') l.sort((a, b) => precoFinal(b) - precoFinal(a))
    else if (ordem === 'nome') l.sort((a, b) => a.nome.localeCompare(b.nome))
    else l.sort((a, b) => (b.destaque === true) - (a.destaque === true))
    return l
  }, [produtos, cat, busca, ordem])

  const lojaFechada = settings.lojaAtiva === false

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />

      {/* Banner */}
      <section className="relative overflow-hidden bg-navy-950">
        <img src="/midia/marca/marajoara-dark.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-900/50" />
        {/* Assinatura dourada da Social Play, de fundo */}
        <img
          src={assinaturaSocialPlay}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-4%] top-1/2 w-[52%] max-w-xl -translate-y-1/2 select-none opacity-20"
        />
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

      {/* Vistos recentemente */}
      {(() => {
        const vistos = recentes
          .map((id) => produtos.find((p) => p.id === id))
          .filter((p) => p && p.ativo !== false)
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
