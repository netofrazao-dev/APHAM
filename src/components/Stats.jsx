import { Link } from 'react-router-dom'
import { credenciais } from '../data/content'

const CORES = {
  amarelo: '#e0a500',
  laranja: '#ea680c',
  verde: '#2faa3a',
  azul: '#0881c2',
  cinza: '#64748b',
}

const cellCls =
  'flex items-center justify-center rounded-2xl px-5 py-10 text-center transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110'

export default function Stats() {
  return (
    <section className="section-pad relative z-20 -mt-14">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-3xl bg-white p-1.5 shadow-lift lg:grid-cols-4">
          {credenciais.map((c) => {
            const href = c.href || '#'
            const externo = /^https?:\/\//.test(href) || /\.pdf$/i.test(href)
            const interno = href.startsWith('/') && !externo
            const style = { backgroundColor: CORES[c.cor] || '#101d39' }
            const label = (
              <span className="font-display text-base font-extrabold leading-tight text-white sm:text-lg">
                {c.titulo}
              </span>
            )
            return interno ? (
              <Link key={c.titulo} to={href} className={cellCls} style={style}>
                {label}
              </Link>
            ) : (
              <a
                key={c.titulo}
                href={href}
                target={externo ? '_blank' : undefined}
                rel={externo ? 'noopener noreferrer' : undefined}
                className={cellCls}
                style={style}
              >
                {label}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
