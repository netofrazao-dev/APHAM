import { Link } from 'react-router-dom'
import { Package, ClipboardList, Newspaper, Plus, Store } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { statusInfo } from '../../store/constants'
import { PageTitle, Card, btnAccent, btnGhost } from './ui'

export default function Dashboard() {
  const { produtos, orders, novidades } = useStore()
  const ativos = produtos.filter((p) => p.ativo !== false).length
  const novos = orders.filter((o) => o.status === 'recebido').length
  const faturamento = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((s, o) => s + (o.total || 0), 0)

  const cards = [
    { label: 'Produtos', valor: produtos.length, sub: `${ativos} ativos`, icon: Package, to: '/admin/produtos' },
    { label: 'Pedidos', valor: orders.length, sub: `${novos} novos`, icon: ClipboardList, to: '/admin/pedidos' },
    { label: 'Novidades', valor: novidades.length, sub: 'publicadas', icon: Newspaper, to: '/admin/novidades' },
    { label: 'Pedidos (R$)', valor: formatBRL(faturamento), sub: 'exceto cancelados', icon: Store, to: '/admin/pedidos' },
  ]

  return (
    <div>
      <PageTitle title="Painel" subtitle="Visão geral do site e da loja">
        <div className="flex gap-2">
          <Link to="/admin/produtos" className={btnAccent}>
            <Plus className="h-4 w-4" />
            Novo produto
          </Link>
          <Link to="/admin/novidades" className={btnGhost}>
            <Plus className="h-4 w-4" />
            Nova novidade
          </Link>
        </div>
      </PageTitle>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="h-full transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-navy-500">{c.label}</span>
                <c.icon className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="mt-3 font-display text-2xl font-extrabold text-navy-900">{c.valor}</p>
              <p className="text-xs text-navy-400">{c.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-navy-900">Pedidos recentes</h2>
        {orders.length === 0 ? (
          <Card className="text-sm text-navy-500">Nenhum pedido ainda.</Card>
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-navy-100">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{o.numero}</p>
                    <p className="text-xs text-navy-500">
                      {o.cliente?.nome} · {new Date(o.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy-900">{formatBRL(o.total)}</p>
                    <span className="text-xs font-medium text-cyan-700">{statusInfo(o.status).label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
