// Componentes e classes compartilhados do painel admin.

export const inputCls =
  'w-full rounded-xl border border-navy-200 bg-paper px-4 py-2.5 text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-50'

export const btnAccent =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:opacity-50'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50'

export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50'

export function PageTitle({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-navy-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-navy-100 bg-white p-5 ${className}`}>{children}</div>
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-navy-400">{hint}</span>}
    </label>
  )
}
