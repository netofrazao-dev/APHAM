// Etapas de um pedido (fluxo que o cliente acompanha).
export const ORDER_STATUSES = [
  { id: 'recebido', label: 'Pedido recebido', desc: 'Recebemos seu pedido.' },
  { id: 'confirmado', label: 'Confirmado', desc: 'Pagamento/condições confirmados.' },
  { id: 'preparo', label: 'Em preparo', desc: 'Separando seus produtos.' },
  { id: 'rota', label: 'Em rota de entrega', desc: 'Seu pedido saiu para entrega.' },
  { id: 'entregue', label: 'Entregue', desc: 'Pedido entregue. Obrigado!' },
]

export const STATUS_CANCELADO = { id: 'cancelado', label: 'Cancelado', desc: 'Pedido cancelado.' }

export const statusInfo = (id) =>
  ORDER_STATUSES.find((s) => s.id === id) || (id === 'cancelado' ? STATUS_CANCELADO : ORDER_STATUSES[0])

export const statusIndex = (id) => ORDER_STATUSES.findIndex((s) => s.id === id)

export const statusCor = {
  recebido: 'bg-cyan-100 text-cyan-700',
  confirmado: 'bg-sky-100 text-sky-700',
  preparo: 'bg-amber-100 text-amber-700',
  rota: 'bg-indigo-100 text-indigo-700',
  entregue: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
}
