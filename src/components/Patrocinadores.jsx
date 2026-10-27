import { MapPin } from 'lucide-react'
import { patrocinadores } from '../data/content'
import Reveal from './Reveal'

// Faixa de patrocinadores logo acima do rodapé.
export default function Patrocinadores() {
  if (!patrocinadores.length) return null
  return (
    <section aria-label="Patrocinadores" className="section-pad border-t border-navy-100 bg-white py-14 lg:py-16">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Quem apoia a APHAM
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">Nossos patrocinadores</h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          {patrocinadores.map((p, i) => (
            <Reveal key={p.nome} delay={0.05 * i} className="w-full max-w-xs">
              <div className="flex h-full flex-col items-center rounded-2xl border border-navy-100 bg-paper p-6 text-center transition-shadow hover:shadow-soft">
                <img src={p.logo} alt={p.nome} loading="lazy" className="h-28 w-28 object-contain" />
                <p className="mt-4 font-display text-lg font-extrabold text-navy-900">{p.nome}</p>
                {p.endereco && (
                  <p className="mt-2 flex items-start justify-center gap-1.5 text-sm text-ink/70">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                    <span>
                      {p.endereco}
                      {p.referencia && <span className="block text-xs text-ink/55">{p.referencia}</span>}
                    </span>
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
