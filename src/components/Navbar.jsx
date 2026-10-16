import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { nav, hero } from '../data/content'
import Logo from './Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

  const [active, setActive] = useState('')
  useEffect(() => {
    const els = nav
      .map((n) => document.getElementById(n.href.replace('#', '')))
      .filter(Boolean)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-paper/95 backdrop-blur-md shadow-[0_1px_0_rgba(16,29,57,0.08)]' : 'bg-transparent'
      }`}
    >
      <nav className="container-x section-pad flex h-20 items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Logo className="h-10 sm:h-11" light={!solid} />
          <span
            className={`shrink-0 whitespace-nowrap font-script text-base leading-none sm:text-xl lg:text-2xl ${
              solid ? 'text-navy-700' : 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
            }`}
          >
            {hero.assinatura}
          </span>
        </div>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => {
            const isActive = item.href === active
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
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
              </a>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Link to="/loja" className="btn-accent">
            <ShoppingBag className="h-4 w-4" />
            Loja
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
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-navy-800 transition-colors hover:bg-navy-100"
              >
                {item.label}
              </a>
            ))}
            <Link to="/loja" onClick={() => setOpen(false)} className="btn-accent mt-2 w-full">
              <ShoppingBag className="h-4 w-4" />
              Loja
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
