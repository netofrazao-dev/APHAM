import { MapPin } from 'lucide-react'
import { patrocinadores } from '../data/content'

// Patrocinadores no rodapé (parte azul), entre os links e a linha de copyright.
export default function Patrocinadores() {
  if (!patrocinadores.length) return null
  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <p className="eyebrow flex justify-center text-cyan-300">
        <span className="h-px w-6 bg-cyan-400" />
        Patrocinadores
        <span className="h-px w-6 bg-cyan-400" />
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {patrocinadores.map((p) => (
          <li key={p.nome} className="flex flex-col items-center text-center">
            <img src={p.logo} alt={p.nome} title={p.nome} loading="lazy" className={`${p.altura || 'h-16'} w-auto object-contain`} />
            {p.endereco && (
              <p className="mt-3 flex items-start gap-1.5 text-xs text-white/60">
                <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <span>
                  {p.endereco}
                  {p.referencia && <span className="block text-white/45">{p.referencia}</span>}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
