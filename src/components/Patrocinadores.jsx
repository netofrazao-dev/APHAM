import { MapPin } from 'lucide-react'
import { patrocinadores } from '../data/content'

// Apoiadores no rodapé (parte azul), entre os links e a linha de copyright.
export default function Patrocinadores() {
  if (!patrocinadores.length) return null
  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <p className="eyebrow flex justify-center text-cyan-300">
        <span className="h-px w-6 bg-cyan-400" />
        Apoiadores
        <span className="h-px w-6 bg-cyan-400" />
      </p>
      {/* Colunas iguais: todos os logos na mesma faixa de altura, centralizados;
          o endereço (quando há) fica embaixo, sem desalinhar a linha dos logos. */}
      <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {patrocinadores.map((p) => (
          <li key={p.nome} className="flex flex-col items-center text-center">
            <div className="flex h-24 w-full items-center justify-center sm:h-28">
              <img src={p.logo} alt={p.nome} title={p.nome} loading="lazy" className={`${p.altura || 'h-20'} w-auto max-w-full object-contain`} />
            </div>
            {p.endereco && (
              <p className="mt-3 flex max-w-[15rem] items-start justify-center gap-1.5 text-xs text-white/60">
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
