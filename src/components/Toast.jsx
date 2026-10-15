import { createContext, useCallback, useContext, useState } from 'react'
import { Check, Info, X } from 'lucide-react'

const ToastCtx = createContext(null)
export function useToast() {
  return useContext(ToastCtx) || (() => {})
}

let idc = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((mensagem, tipo = 'sucesso') => {
    const id = ++idc
    setToasts((t) => [...t, { id, mensagem, tipo }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-medium text-white shadow-lift"
          >
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${t.tipo === 'erro' ? 'bg-red-500' : 'bg-cyan-500'}`}>
              {t.tipo === 'erro' ? <X className="h-3.5 w-3.5" /> : t.tipo === 'info' ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            {t.mensagem}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
