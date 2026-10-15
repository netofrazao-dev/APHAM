import { Link } from 'react-router-dom'
import { site } from '../../data/content'

export default function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-navy-100 bg-white">
      <div className="container-x section-pad flex flex-col items-center justify-between gap-3 py-8 text-sm text-navy-600 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.nome} — Loja oficial.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to="/" className="transition-colors hover:text-cyan-600">
            Site da APHAM
          </Link>
          <Link to="/loja" className="transition-colors hover:text-cyan-600">
            Loja
          </Link>
          <Link to="/pedido" className="transition-colors hover:text-cyan-600">
            Acompanhar pedido
          </Link>
          <Link to="/admin" className="text-navy-400 transition-colors hover:text-cyan-600">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
