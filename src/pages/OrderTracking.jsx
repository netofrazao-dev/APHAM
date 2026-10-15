import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Search, PackageSearch } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { formatBRL } from '../store/format'
import { statusInfo } from '../store/constants'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import OrderTimeline from '../components/store/OrderTimeline'

export default function OrderTracking() {
  const { numero } = useParams()
  const navigate = useNavigate()
  const { orders } = useStore()
  const [busca, setBusca] = useState('')

  const order = numero ? orders.find((o) => o.numero.toLowerCase() === numero.toLowerCase()) : null

  const buscar = (e) => {
    e.preventDefault()
    if (busca.trim()) navigate(`/pedido/${busca.trim()}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />
      <div className="container-x section-pad flex-1 py-10">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Acompanhar pedido</h1>

        {/* Busca */}
        <form onSubmit={buscar} className="mt-6 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Número do pedido (ex.: APHAM-123456)"
              className="w-full rounded-full border border-navy-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500"
            />
          </div>
          <button type="submit" className="rounded-full bg-navy-800 px-5 text-sm font-semibold text-white hover:bg-navy-900">Buscar</button>
        </form>

        {numero && !order && (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-200 py-16 text-center">
            <PackageSearch className="h-10 w-10 text-navy-300" />
            <p className="text-navy-600">Pedido <strong>{numero}</strong> não encontrado neste dispositivo.</p>
            <p className="max-w-md text-sm text-navy-400">
              O acompanhamento fica salvo no navegador em que o pedido foi feito. (Com o banco de
              dados, poderá ser consultado de qualquer aparelho.)
            </p>
          </div>
        )}

        {order && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-navy-100 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-extrabold text-navy-900">{order.numero}</p>
                    <p className="text-xs text-navy-500">{new Date(order.data).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                    {statusInfo(order.status).label}
                  </span>
                </div>
                <div className="mt-6">
                  <OrderTimeline status={order.status} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-navy-100 bg-white p-6">
                <h2 className="font-display font-bold text-navy-900">Resumo</h2>
                <ul className="mt-4 space-y-2 text-sm text-navy-700">
                  {order.itens?.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-3">
                      <span>{i.qtd}x {i.nome}</span>
                      <span className="font-medium">{formatBRL(i.preco * i.qtd)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
                  <span className="font-display font-bold text-navy-900">Total</span>
                  <span className="font-display text-lg font-extrabold text-navy-900">{formatBRL(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Link to="/loja" className="mt-8 inline-block text-sm font-medium text-navy-600 hover:text-cyan-700">← Voltar à loja</Link>
      </div>
      <StoreFooter />
    </div>
  )
}
