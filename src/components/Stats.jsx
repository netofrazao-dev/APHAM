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
        <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-3xl bg-white p-1.5 shadow-lift lg:grid-cols-4">
          {credenciais.map((c) => {
            const externo = /^https?:\/\//.test(c.href || '')
            return (
              <a
                key={c.titulo}
                href={c.href || '#'}
                target={externo ? '_blank' : undefined}
                rel={externo ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-center rounded-2xl px-5 py-10 text-center transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{ backgroundColor: CORES[c.cor] || '#101d39' }}
              >
                <span className="font-display text-base font-extrabold leading-tight text-white sm:text-lg">
                  {c.titulo}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
