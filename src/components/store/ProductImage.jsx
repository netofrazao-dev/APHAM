import { Shirt } from 'lucide-react'

// Mostra a 1ª imagem do produto; se não houver, um placeholder com a marca.
export default function ProductImage({ produto, className = '' }) {
  const src = produto?.imagens?.[0]
  if (src) {
    return (
      <img
        src={src}
        alt={produto?.nome || 'Produto'}
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-300/80 ${className}`}
      aria-label={produto?.nome || 'Produto'}
    >
      <Shirt className="h-10 w-10" strokeWidth={1.5} />
      <span className="px-3 text-center text-[11px] font-semibold uppercase tracking-wide text-white/50">
        {produto?.nome || 'Produto APHAM'}
      </span>
    </div>
  )
}
