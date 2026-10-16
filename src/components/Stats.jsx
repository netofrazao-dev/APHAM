import { ArrowUpRight } from 'lucide-react'
import { credenciais } from '../data/content'

const CORES = {
  amarelo: '#e0a500',
  laranja: '#ea680c',
  verde: '#2faa3a',
  azul: '#0881c2',
  cinza: '#64748b',
}

export default function Stats() {
  return (
    <section className="section-pad relative z-20 -mt-14">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-100 shadow-lift lg:grid-cols-4">
          {credenciais.map((c) => {
            const externo = /^https?:\/\//.test(c.href || '')
            return (
              <a
                key={c.titulo}
                href={c.href || '#'}
                target={externo ? '_blank' : undefined}
                rel={externo ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center justify-center gap-2 bg-white px-5 py-8 text-center transition-colors hover:bg-navy-50"
              >
                <span
                  className="font-display text-lg font-extrabold leading-tight sm:text-xl"
                  style={{ color: CORES[c.cor] || '#101d39' }}
                >
                  {c.titulo}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-navy-500 transition-colors group-hover:text-navy-800">
                  ver documento
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
