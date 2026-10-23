import { useEffect, useState } from 'react'

// Alterna entre imagens com efeito de transição (crossfade). Cada item:
// { src, className } — o className define object-contain/cover e padding.
// Com uma imagem só, mostra ela parada.
export default function AlternaImagem({ imagens, intervalo = 4500, className = '', alt = '' }) {
  const lista = (imagens || []).filter((im) => im && im.src)
  const [i, setI] = useState(0)

  useEffect(() => {
    if (lista.length <= 1) return
    const id = setInterval(() => setI((p) => (p + 1) % lista.length), intervalo)
    return () => clearInterval(id)
  }, [lista.length, intervalo])

  if (!lista.length) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {lista.map((im, idx) => (
        <img
          key={idx}
          src={im.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-in-out ${im.className || 'object-cover'}`}
          style={{ opacity: idx === (i % lista.length) ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
