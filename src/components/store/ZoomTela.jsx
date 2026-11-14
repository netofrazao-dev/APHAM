import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const MAX = 4

// Foto do produto em tela cheia, com zoom: pinça com dois dedos ou toque duplo
// (celular), roda do mouse ou clique duplo (computador); arrasta para ver os
// detalhes quando ampliada; sem zoom, desliza para trocar de foto.
export default function ZoomTela({ fotos, inicial = 0, alt = '', onFechar }) {
  const [i, setI] = useState(inicial)
  const [zoom, setZoom] = useState({ s: 1, x: 0, y: 0 })
  const ponteiros = useRef(new Map())
  const gesto = useRef(null)
  const ultimoToque = useRef(0)
  const tipoPonteiro = useRef('mouse') // no toque, o navegador também dispara dblclick: só o mouse usa
  const area = useRef(null)
  const total = fotos.length

  const ir = (n) => {
    setI((n + total) % total)
    setZoom({ s: 1, x: 0, y: 0 })
  }

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'Escape') onFechar()
      if (e.key === 'ArrowRight') ir(i + 1)
      if (e.key === 'ArrowLeft') ir(i - 1)
    }
    window.addEventListener('keydown', tecla)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tecla)
      document.body.style.overflow = antes
    }
  })

  // Amplia mantendo o ponto (px, py) da tela no mesmo lugar.
  const ampliar = (novo, px, py) => {
    setZoom((z) => {
      const s = Math.min(MAX, Math.max(1, novo))
      if (s === 1) return { s: 1, x: 0, y: 0 }
      const r = area.current.getBoundingClientRect()
      const cx = px - r.left - r.width / 2
      const cy = py - r.top - r.height / 2
      return { s, x: cx - ((cx - z.x) * s) / z.s, y: cy - ((cy - z.y) * s) / z.s }
    })
  }

  const down = (e) => {
    tipoPonteiro.current = e.pointerType
    e.currentTarget.setPointerCapture?.(e.pointerId)
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const p = [...ponteiros.current.values()]
    if (p.length === 2) {
      gesto.current = { tipo: 'pinca', dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), s: zoom.s }
    } else if (p.length === 1) {
      gesto.current = { tipo: 'arrasto', x0: e.clientX, y0: e.clientY, zx: zoom.x, zy: zoom.y, t: Date.now() }
    }
  }
  const move = (e) => {
    if (!ponteiros.current.has(e.pointerId)) return
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesto.current
    const p = [...ponteiros.current.values()]
    if (g?.tipo === 'pinca' && p.length === 2) {
      const dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)
      ampliar((g.s * dist) / g.dist, (p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2)
    } else if (g?.tipo === 'arrasto' && zoom.s > 1) {
      setZoom((z) => ({ ...z, x: g.zx + e.clientX - g.x0, y: g.zy + e.clientY - g.y0 }))
    }
  }
  const up = (e) => {
    const g = gesto.current
    ponteiros.current.delete(e.pointerId)
    if (ponteiros.current.size) return
    gesto.current = null
    if (g?.tipo !== 'arrasto') return
    const dx = e.clientX - g.x0
    const dy = e.clientY - g.y0
    // Sem zoom, deslizar troca de foto.
    if (zoom.s === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return ir(dx < 0 ? i + 1 : i - 1)
    // Toque duplo (celular) amplia ou volta ao normal.
    if (e.pointerType !== 'mouse' && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const agora = Date.now()
      if (agora - ultimoToque.current < 300) {
        ampliar(zoom.s > 1 ? 1 : 2.5, e.clientX, e.clientY)
        ultimoToque.current = 0
      } else ultimoToque.current = agora
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-navy-950/95" role="dialog" aria-modal="true" aria-label={`Foto ampliada: ${alt}`}>
      <div className="flex items-center justify-between px-4 py-3 text-white/80">
        <span className="text-sm">
          {total > 1 && `${i + 1} / ${total} · `}
          <span className="inline-flex items-center gap-1">
            <ZoomIn className="h-4 w-4" />
            {zoom.s > 1 ? 'Arraste para ver os detalhes' : 'Toque duas vezes ou use dois dedos para ampliar'}
          </span>
        </span>
        <button type="button" onClick={onFechar} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={area}
        className="relative flex-1 touch-none select-none overflow-hidden"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onDoubleClick={(e) => tipoPonteiro.current === 'mouse' && ampliar(zoom.s > 1 ? 1 : 2.5, e.clientX, e.clientY)}
        onWheel={(e) => ampliar(zoom.s * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY)}
      >
        <img
          src={fotos[i]}
          alt={alt}
          draggable={false}
          className={`absolute inset-0 m-auto max-h-full max-w-full object-contain ${gesto.current ? '' : 'transition-transform duration-200'} ${zoom.s > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
          style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})` }}
        />
        {total > 1 && zoom.s === 1 && (
          <>
            <button type="button" onClick={() => ir(i - 1)} onPointerDown={(e) => e.stopPropagation()} className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Foto anterior">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => ir(i + 1)} onPointerDown={(e) => e.stopPropagation()} className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Próxima foto">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
