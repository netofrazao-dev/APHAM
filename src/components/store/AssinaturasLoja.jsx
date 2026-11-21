import { useEffect, useState } from 'react'
import { assinaturaSocialPlay } from '../../data/content'

const TROCA_MS = 4500

// Lado esquerdo do banner da loja: alterna a assinatura da Social Play e a da
// Cooperativa Social (COOPTE*SE — Cooperativa de Tecnologia Social e
// Empreendedorismo da APHAM). A da cooperativa é um
// letreiro em texto; se chegar o arquivo da marca, troque por uma <img>.
export default function AssinaturasLoja() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % 2), TROCA_MS)
    return () => clearInterval(t)
  }, [])
  const fase = (n) => `absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 md:items-start ${i === n ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'}`

  return (
    <div className="relative h-72 sm:h-96 lg:h-[28rem]" role="img" aria-label="Social Play e Cooperativa Social COOPTE*SE">
      <div className={fase(0)} aria-hidden={i !== 0}>
        {/* O texto fica no vão embaixo da assinatura, entre a perna do "p" e a do
            "y" (medido no PNG: ~47–86% da largura, ~55–78% da altura). Só a
            assinatura pulsa; o texto fica parado. */}
        <div className="relative h-[88%] [container-type:inline-size]" style={{ aspectRatio: '760 / 636' }}>
          <img
            src={assinaturaSocialPlay}
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] motion-safe:animate-respira"
            draggable={false}
          />
          <p
            className="absolute left-[47%] top-[56%] w-[38%] text-center font-semibold leading-tight text-white/90"
            style={{ fontSize: 'clamp(11px, 5cqw, 26px)' }}
          >
            Para além
            <br />
            do Jogo!
          </p>
        </div>
      </div>
      <div className={fase(1)} aria-hidden={i !== 1}>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Cooperativa Social</span>
        <p className="mt-2 font-display text-5xl font-black leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
          COOPTE<span className="text-cyan-400">✱</span>SE
        </p>
        <p className="mt-3 max-w-md text-base font-medium leading-snug text-white/85 sm:text-lg">Cooperativa de Tecnologia Social e Empreendedorismo da APHAM</p>
      </div>
      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:left-0 md:translate-x-0">
        {[0, 1].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setI(n)}
            aria-label={n === 0 ? 'Ver a assinatura Social Play' : 'Ver a assinatura da Cooperativa Social'}
            className={`h-1.5 rounded-full transition-all ${i === n ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
