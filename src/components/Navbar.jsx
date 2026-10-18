import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Youtube, Facebook, Instagram } from 'lucide-react'
import { nav, sumario, hero, site, redesHeader } from '../data/content'
import Logo from './Logo'

const SOCIAL_ICONS = { Youtube, Facebook, Instagram }
const redes = redesHeader.map((r) => ({ ...r, href: site[r.url] }))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Fora da home não há "herói" escuro atrás, então a barra fica sempre sólida.
  const solid = scrolled || open || !isHome

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-paper/95 backdrop-blur-md shadow-[0_1px_0_rgba(16,29,57,0.08)]' : 'bg-transparent'
      }`}
    >
      <nav className="container-x section-pad flex h-20 items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/" aria-label="Ir para o início" className="flex items-center gap-2 sm:gap-3">
            <Logo className="h-10 sm:h-11" light={!solid} />
            <span
              className={`shrink-0 whitespace-nowrap font-script text-base leading-none sm:text-lg lg:text-lg xl:text-xl ${
                solid ? 'text-navy-700' : 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
              }`}
            >
              {hero.assinatura}
            </span>
          </Link>
        </div>

        {/* Redes sociais no header — entre a assinatura e o menu */}
        <div className="hidden items-center gap-1.5 xl:flex">
          {redes.map((r) => {
            const Ic = SOCIAL_ICONS[r.icone]
            return (
              <a
                key={r.nome}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={r.nome}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                  solid
                    ? 'border-navy-200 text-navy-700 hover:bg-navy-100'
                    : 'border-white/30 text-white hover:bg-white/15'
                }`}
              >
                <Ic className="h-4 w-4" />
              </a>
            )
          })}
        </div>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => {
            const isActive = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
                  solid
                    ? isActive
                      ? 'bg-navy-100 text-navy-900'
                      : 'text-navy-800/80 hover:bg-navy-100 hover:text-navy-900'
                    : isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link to="/loja" className="btn-primary whitespace-nowrap ring-1 ring-white/25">
            <ShoppingBag className="h-4 w-4" />
            Loja SocialPlay
          </Link>
        </div>

        {/* Botão menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors xl:hidden ${
            solid
              ? 'border-navy-200 bg-white/70 text-navy-800'
              : 'border-white/30 bg-white/10 text-white'
          }`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Painel mobile */}
      <div className={open ? 'pointer-events-auto xl:hidden' : 'pointer-events-none xl:hidden'}>
        <div
          className={`origin-top overflow-hidden border-t border-navy-100 bg-paper shadow-lift transition-all duration-300 ${
            open ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-x section-pad flex flex-col gap-1 py-4">
            {sumario.map((item) => {
              const isAnchor = item.to.includes('#')
              const isActive = !isAnchor && pathname === item.to
              const cls = `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                isActive ? 'bg-navy-100 text-navy-900' : 'text-navy-800 hover:bg-navy-100'
              }`
              return isAnchor ? (
                <a key={item.label} href={item.to} onClick={() => setOpen(false)} className={cls}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cls}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link to="/loja" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              <ShoppingBag className="h-4 w-4" />
              Loja SocialPlay
            </Link>

            {/* Redes sociais no menu mobile */}
            <div className="mt-3 flex items-center justify-center gap-3 border-t border-navy-100 pt-4">
              {redes.map((r) => {
                const Ic = SOCIAL_ICONS[r.icone]
                return (
                  <a
                    key={r.nome}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.nome}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:bg-navy-100"
                  >
                    <Ic className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
