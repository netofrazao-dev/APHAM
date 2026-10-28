import { Link } from 'react-router-dom'
import { ShoppingBag, Clock } from 'lucide-react'
import { site, nav, contato } from '../data/content'
import { useStore } from '../store/StoreContext'
import Logo from './Logo'
import Icon from './Icon'
import MarajoaraBand from './MarajoaraBand'
import Patrocinadores from './Patrocinadores'

export default function Footer() {
  const { settings } = useStore()
  const endereco = settings?.endereco || site.endereco
  const email = settings?.email || site.email
  const telefone = settings?.telefone || site.telefone
  return (
    <footer className="relative bg-navy-950 text-white">
      <MarajoaraBand className="h-3 w-full" color="#12a0e6" />
      <div className="section-pad container-x py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" aria-label="Ir para o início" className="inline-block">
              <Logo className="h-16" light />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {site.nomeCompleto}. Desde 2009, promovendo o esporte, a inclusão social e a formação
              da juventude em {site.cidade}, {site.estado}.
            </p>
            <img
              src="/midia/marca/assinatura-branca-dark.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="mt-6 h-14 w-auto object-contain opacity-80 mix-blend-screen"
            />
            <div className="mt-6 flex gap-3">
              {contato.redes.map((r) => (
                <a
                  key={r.nome}
                  href={r.url}
                  target={r.url.startsWith('http') ? '_blank' : undefined}
                  rel={r.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={r.nome}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-cyan-500"
                >
                  <Icon name={r.icone} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Navegação
            </h4>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/60 transition-colors hover:text-cyan-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Institucional
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/participar" className="text-sm text-white/60 transition-colors hover:text-cyan-400">
                  Como participar
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-white/60 transition-colors hover:text-cyan-400">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-sm text-white/60 transition-colors hover:text-cyan-400">
                  Privacidade e Termos
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
              Contato
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>{endereco}</li>
              <li>{email}</li>
              <li>{telefone}</li>
            </ul>
            {site.lojaPausada ? (
              <span className="btn-accent pointer-events-none mt-6 opacity-90">
                <Clock className="h-4 w-4" />
                Loja em breve
              </span>
            ) : (
              <Link to="/loja" className="btn-accent mt-6">
                <ShoppingBag className="h-4 w-4" />
                Visitar a loja
              </Link>
            )}
          </div>
        </div>

        <Patrocinadores />

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.nome} — {site.nomeCompleto}.
          </p>
          <p>Entidade de utilidade pública · Lei Estadual nº 10.594/2024</p>
        </div>

        {/* Crédito do desenvolvedor, discreto. */}
        <p className="mt-4 text-center text-[11px] text-white/30">
          Site desenvolvido por{' '}
          <a
            href="https://netofrazao.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-400"
          >
            Neto Frazão
          </a>
        </p>
      </div>
    </footer>
  )
}
