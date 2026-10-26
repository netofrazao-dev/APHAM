import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { formatBRL } from '../store/format'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductCard from '../components/store/ProductCard'

export default function Cart() {
  const { cart, updateQtd, removeFromCart, cartTotal, produtos } = useStore()
  const idsNoCarrinho = new Set(cart.map((i) => i.id))
  const sugestoes = produtos
    .filter((p) => p.ativo !== false && Number(p.estoque) > 0 && !idsNoCarrinho.has(p.id))
    .sort((a, b) => (b.destaque === true) - (a.destaque === true))
    .slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />
      <div className="container-x section-pad flex-1 py-10">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Seu carrinho</h1>

        {cart.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-dashed border-navy-200 py-20 text-center">
            <ShoppingBag className="h-10 w-10 text-navy-300" />
            <p className="text-navy-600">Seu carrinho está vazio.</p>
            <Link to="/loja" className="btn-accent">Ver produtos</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Itens */}
            <div className="lg:col-span-2">
              <ul className="space-y-4">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-100">
                      {item.imagem ? (
                        <img src={item.imagem} alt={item.nome} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-navy-300">
                          <ShoppingBag className="h-7 w-7" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-sm font-bold text-navy-900">{item.nome}</h3>
                          {(item.tamanho || item.cor) && (
                            <p className="mt-0.5 text-xs text-navy-500">
                              {[item.tamanho, item.cor].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {item.lojaNome && <p className="mt-0.5 text-xs text-violet-700">Vendido por {item.lojaNome}</p>}
                        </div>
                        <button type="button" onClick={() => removeFromCart(idx)} className="text-navy-400 hover:text-cyan-700" aria-label="Remover">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-lg border border-navy-200">
                          <button type="button" onClick={() => updateQtd(idx, item.qtd - 1)} className="flex h-8 w-8 items-center justify-center text-navy-700 hover:bg-navy-100" aria-label="Diminuir">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-9 text-center text-sm font-semibold">{item.qtd}</span>
                          <button type="button" onClick={() => updateQtd(idx, item.qtd + 1)} className="flex h-8 w-8 items-center justify-center text-navy-700 hover:bg-navy-100" aria-label="Aumentar">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-navy-900">{formatBRL(item.preco * item.qtd)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-navy-900">Resumo</h2>
                <div className="mt-4 flex items-center justify-between text-sm text-navy-600">
                  <span>Subtotal</span>
                  <span>{formatBRL(cartTotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-navy-600">
                  <span>Entrega</span>
                  <span>a combinar</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
                  <span className="font-display font-bold text-navy-900">Total</span>
                  <span className="font-display text-xl font-extrabold text-navy-900">{formatBRL(cartTotal)}</span>
                </div>
                <Link to="/checkout" className="btn-accent mt-6 w-full">
                  Finalizar pedido
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/loja" className="mt-3 block text-center text-sm font-medium text-navy-600 hover:text-cyan-700">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Complete seu pedido */}
        {cart.length > 0 && sugestoes.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 font-display text-xl font-bold text-navy-900">Complete seu pedido</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {sugestoes.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  )
}
