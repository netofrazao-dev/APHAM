import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useStore } from '../../store/StoreContext'

export default function StoreHeader() {
  const { cartCount, settings } = useStore()
  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-paper/95 backdrop-blur-md">
      <div className="container-x section-pad flex h-20 items-center justify-between">
        <Link to="/loja" className="flex items-center gap-3" aria-label={`${settings.nomeLoja} — início`}>
          <img src="/midia/logo-apham.png" alt="APHAM" className="h-10 w-auto" />
          <span className="hidden font-display text-lg font-extrabold text-navy-800 sm:block">
            {settings.nomeLoja}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-100 sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <Link
            to="/carrinho"
            className="relative inline-flex h-11 items-center gap-2 rounded-full bg-navy-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
