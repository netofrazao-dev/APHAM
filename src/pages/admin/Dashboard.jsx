import { Link } from 'react-router-dom'
import { Package, ClipboardList, Newspaper, Plus, Store, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { statusInfo } from '../../store/constants'
import { saldoDaLoja } from '../../store/lojas'
import { PageTitle, Card, btnAccent, btnGhost } from './ui'

export default function Dashboard() {
  const { produtos, orders, novidades, lojas, repasses } = useStore()
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

  // O que pede ação da APHAM. Com a loja só de pronta entrega, basta olhar isto
  // de vez em quando: o resto (estoque, pagamento) se atualiza sozinho.
  const vendendo = produtos.filter((p) => p.ativo !== false && p.estoque != null && p.estoque !== '')
  const esgotados = vendendo.filter((p) => Number(p.estoque) <= 0)
  const acabando = vendendo.filter((p) => Number(p.estoque) > 0 && Number(p.estoque) <= 3)
  const aRepassar = (lojas || [])
    .filter((l) => l.status === 'aprovada')
    .map((l) => ({ loja: l, valor: saldoDaLoja(orders, repasses, l.id).aReceber }))
    .filter((x) => x.valor > 0.009)
  const nomes = (lista) => lista.slice(0, 3).map((p) => p.nome).join(', ') + (lista.length > 3 ? '…' : '')
  const atencao = [
    {
      n: orders.filter((o) => o.status === 'confirmado').length,
      texto: (n) => `${n === 1 ? 'pedido pago' : 'pedidos pagos'} para separar e entregar`,
      to: '/admin/pedidos',
    },
    {
      n: orders.filter((o) => o.status === 'recebido' && o.pagamento !== 'online').length,
      texto: (n) => `${n === 1 ? 'pedido novo' : 'pedidos novos'} para confirmar o pagamento (PIX/WhatsApp)`,
      to: '/admin/pedidos',
    },
    { n: esgotados.length, texto: (n) => `${n === 1 ? 'produto esgotado' : 'produtos esgotados'}: ${nomes(esgotados)}`, to: '/admin/produtos' },
    { n: acabando.length, texto: (n) => `com estoque baixo (até 3): ${nomes(acabando)}`, to: '/admin/produtos' },
    {
      n: (lojas || []).filter((l) => l.status === 'pendente').length,
      texto: (n) => `${n === 1 ? 'loja parceira aguardando' : 'lojas parceiras aguardando'} aprovação`,
      to: '/admin/lojas',
    },
    {
      n: aRepassar.length,
      texto: () =>
        `repasse a fazer: ${aRepassar.map((x) => `${x.loja.nome} (${formatBRL(x.valor)})`).join(', ')}`,
      to: '/admin/lojas',
    },
  ].filter((a) => a.n > 0)

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

      <Card className="mb-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
          {atencao.length ? (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          )}
          {atencao.length ? 'Precisa de atenção' : 'Tudo em dia na loja'}
        </h2>
        {atencao.length > 0 ? (
          <ul className="mt-3 divide-y divide-navy-100">
            {atencao.map((a) => (
              <li key={a.texto(a.n)}>
                <Link to={a.to} className="flex items-center gap-3 py-2.5 text-sm text-navy-700 hover:text-cyan-700">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-bold text-amber-800">
                    {a.n}
                  </span>
                  <span className="min-w-0 flex-1">{a.texto(a.n)}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-navy-300" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-navy-500">Nenhum pedido para separar, nada esgotado e nenhuma loja esperando.</p>
        )}
      </Card>

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
