import { useState } from 'react'
import { Trash2, ChevronDown, MessageCircle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { ORDER_STATUSES, statusInfo, statusCor } from '../../store/constants'
import { PageTitle, Card } from './ui'

const STATUS_IDS = [...ORDER_STATUSES.map((s) => s.id), 'cancelado']

export default function OrdersAdmin() {
  const { orders, updateOrder, deleteOrder } = useStore()
  const [aberto, setAberto] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const lista = filtro === 'todos' ? orders : orders.filter((o) => o.status === filtro)

  const excluir = (o) => {
    if (window.confirm(`Excluir o pedido ${o.numero}?`)) deleteOrder(o.id)
  }

  const linkWpp = (o) => `https://wa.me/${(o.cliente?.telefone || '').replace(/\D/g, '')}`

  return (
    <div>
      <PageTitle title="Pedidos" subtitle={`${orders.length} pedido(s)`}>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800">
          <option value="todos">Todos</option>
          {STATUS_IDS.map((s) => (
            <option key={s} value={s}>{statusInfo(s).label}</option>
          ))}
        </select>
      </PageTitle>

      {lista.length === 0 ? (
        <Card className="text-sm text-navy-500">Nenhum pedido {filtro !== 'todos' ? 'com esse status' : 'ainda'}.</Card>
      ) : (
        <div className="space-y-3">
          {lista.map((o) => (
            <Card key={o.id} className="p-0">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button type="button" onClick={() => setAberto(aberto === o.id ? null : o.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${aberto === o.id ? 'rotate-180' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-navy-900">{o.numero}</p>
                    <p className="truncate text-xs text-navy-500">{o.cliente?.nome} · {new Date(o.data).toLocaleString('pt-BR')}</p>
                  </div>
                </button>
                <span className="font-display text-sm font-bold text-navy-900">{formatBRL(o.total)}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusCor[o.status] || 'bg-navy-100 text-navy-700'}`}>
                  {statusInfo(o.status).label}
                </span>
              </div>

              {aberto === o.id && (
                <div className="border-t border-navy-100 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Itens</p>
                      <ul className="mt-2 space-y-1 text-sm text-navy-700">
                        {o.itens?.map((i, idx) => (
                          <li key={idx} className="flex justify-between gap-3">
                            <span>
                              {i.qtd}x {i.nome}
                              {(i.tamanho || i.cor) && <span className="text-navy-400"> ({[i.tamanho, i.cor].filter(Boolean).join(', ')})</span>}
                              {i.lojaId && <span className="ml-1.5 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">{i.lojaNome || 'Loja parceira'}</span>}
                            </span>
                            <span className="font-medium">{formatBRL(i.preco * i.qtd)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 space-y-0.5 border-t border-navy-100 pt-2 text-sm text-navy-600">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatBRL(o.subtotal ?? o.total)}</span></div>
                        {o.desconto > 0 && <div className="flex justify-between text-cyan-700"><span>Desconto {o.cupomCodigo ? `(${o.cupomCodigo})` : ''}</span><span>-{formatBRL(o.desconto)}</span></div>}
                        {o.frete > 0 && <div className="flex justify-between"><span>Entrega</span><span>{formatBRL(o.frete)}</span></div>}
                        <div className="flex justify-between font-bold text-navy-900"><span>Total</span><span>{formatBRL(o.total)}</span></div>
                      </div>
                      {/* Divisão com as lojas parceiras */}
                      {o.itens?.some((i) => i.lojaId) && (
                        <div className="mt-3 rounded-xl bg-violet-50 p-3 text-xs text-violet-900">
                          <p className="font-bold uppercase tracking-wide">Repasse às lojas</p>
                          {[...new Set(o.itens.filter((i) => i.lojaId).map((i) => i.lojaId))].map((lid) => {
                            const its = o.itens.filter((i) => i.lojaId === lid)
                            const lojista = its.reduce((s, i) => s + (i.precoLojista ?? i.preco) * i.qtd, 0)
                            const cliente = its.reduce((s, i) => s + i.preco * i.qtd, 0)
                            return (
                              <div key={lid} className="mt-1 flex justify-between gap-2">
                                <span>{its[0].lojaNome || 'Loja parceira'}</span>
                                <span>
                                  lojista {formatBRL(lojista)} · APHAM {formatBRL(cliente - lojista)}
                                </span>
                              </div>
                            )
                          })}
                          <p className="mt-1.5 text-violet-700/80">Entra no “A repassar” da loja quando o pedido for confirmado.</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-navy-700">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Cliente</p>
                      <p className="mt-2">{o.cliente?.nome}</p>
                      <p>{o.cliente?.telefone}</p>
                      {o.cliente?.email && <p>{o.cliente.email}</p>}
                      <p className="mt-2"><span className="text-navy-400">Entrega:</span> {o.entrega === 'entrega' ? 'Entrega' : 'Retirada'}{o.entrega === 'entrega' && o.endereco ? ` — ${o.endereco}` : ''}</p>
                      <p><span className="text-navy-400">Pagamento:</span> {o.pagamento === 'pix' ? 'PIX' : 'A combinar'}</p>
                      {o.obs && <p className="mt-1"><span className="text-navy-400">Obs:</span> {o.obs}</p>}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy-100 pt-4">
                    <label className="text-sm font-medium text-navy-700">
                      Status:{' '}
                      <select value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })} className="ml-1 rounded-lg border border-navy-200 bg-white px-2 py-1.5 text-sm">
                        {STATUS_IDS.map((s) => (
                          <option key={s} value={s}>{statusInfo(s).label}</option>
                        ))}
                      </select>
                    </label>
                    {o.cliente?.telefone && (
                      <a href={linkWpp(o)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-600">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp do cliente
                      </a>
                    )}
                    <button type="button" onClick={() => excluir(o)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
