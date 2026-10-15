import { Check, Circle, XCircle } from 'lucide-react'
import { ORDER_STATUSES, statusIndex } from '../../store/constants'

export default function OrderTimeline({ status }) {
  if (status === 'cancelado') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
        <XCircle className="h-5 w-5" />
        <span className="font-medium">Pedido cancelado</span>
      </div>
    )
  }
  const atual = Math.max(0, statusIndex(status))
  return (
    <ol className="space-y-0">
      {ORDER_STATUSES.map((s, i) => {
        const feito = i < atual
        const ativo = i === atual
        const ultimo = i === ORDER_STATUSES.length - 1
        return (
          <li key={s.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  feito ? 'bg-cyan-500 text-white' : ativo ? 'bg-cyan-500 text-white ring-4 ring-cyan-100' : 'bg-navy-100 text-navy-400'
                }`}
              >
                {feito ? <Check className="h-4 w-4" /> : <Circle className={`h-3 w-3 ${ativo ? 'fill-current' : ''}`} />}
              </span>
              {!ultimo && <span className={`my-1 w-0.5 flex-1 ${feito ? 'bg-cyan-500' : 'bg-navy-100'}`} style={{ minHeight: 24 }} />}
            </div>
            <div className={`pb-6 ${ativo ? '' : ''}`}>
              <p className={`font-display text-sm font-bold ${feito || ativo ? 'text-navy-900' : 'text-navy-400'}`}>{s.label}</p>
              <p className="text-xs text-navy-500">{s.desc}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
