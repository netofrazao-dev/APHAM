import { useEffect, useState } from 'react'

// Escudo de time ocupando todo o bloco, sem "moldura": descobre a cor de fundo da
// imagem pelos cantos, uniformiza tons próximos a ela (molduras/sombras claras),
// corta as margens e centraliza o desenho num quadrado com essa mesma cor.
// Funciona com qualquer escudo, inclusive os enviados pelo painel.

const cache = new Map()
const LIMIAR = 48 // diferença (R+G+B) para considerar um pixel "fundo"
const MAX = 700 // processa no máximo 700 px de lado

function processar(src) {
  if (cache.has(src)) return cache.get(src)
  const p = new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const esc = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
        const w = Math.max(1, Math.round(img.naturalWidth * esc))
        const h = Math.max(1, Math.round(img.naturalHeight * esc))
        const cv = document.createElement('canvas')
        cv.width = w
        cv.height = h
        const ctx = cv.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, w, h)
        const dados = ctx.getImageData(0, 0, w, h)
        const px = dados.data

        // Cor de fundo: média dos 4 cantos (blocos de 4x4).
        let r = 0, g = 0, b = 0, n = 0
        for (const [cx, cy] of [[0, 0], [w - 4, 0], [0, h - 4], [w - 4, h - 4]]) {
          for (let y = Math.max(0, cy); y < Math.min(h, cy + 4); y++)
            for (let x = Math.max(0, cx); x < Math.min(w, cx + 4); x++) {
              const i = (y * w + x) * 4
              r += px[i]; g += px[i + 1]; b += px[i + 2]; n++
            }
        }
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n)

        // Uniformiza o fundo e acha a área do desenho.
        let x0 = w, y0 = h, x1 = -1, y1 = -1
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4
            const fundo = px[i + 3] < 16 || Math.abs(px[i] - r) + Math.abs(px[i + 1] - g) + Math.abs(px[i + 2] - b) <= LIMIAR
            if (fundo) {
              px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255
            } else {
              if (x < x0) x0 = x
              if (x > x1) x1 = x
              if (y < y0) y0 = y
              if (y > y1) y1 = y
            }
          }
        if (x1 < 0) return resolve({ url: src, cor: `rgb(${r},${g},${b})` })
        ctx.putImageData(dados, 0, 0)

        // Recorta e centraliza num quadrado com 7% de respiro.
        const bw = x1 - x0 + 1
        const bh = y1 - y0 + 1
        const lado = Math.round(Math.max(bw, bh) * 1.14)
        const out = document.createElement('canvas')
        out.width = lado
        out.height = lado
        const octx = out.getContext('2d')
        octx.fillStyle = `rgb(${r},${g},${b})`
        octx.fillRect(0, 0, lado, lado)
        octx.drawImage(cv, x0, y0, bw, bh, Math.round((lado - bw) / 2), Math.round((lado - bh) / 2), bw, bh)
        resolve({ url: out.toDataURL('image/png'), cor: `rgb(${r},${g},${b})` })
      } catch {
        resolve({ url: src, cor: null }) // imagem de outro domínio sem permissão: usa a original
      }
    }
    img.onerror = () => resolve({ url: src, cor: null })
    img.src = src
  })
  cache.set(src, p)
  return p
}

export default function Escudo({ src, alt = '', fundo = '#ffffff', className = '', imgClassName = '' }) {
  const [res, setRes] = useState(null)

  useEffect(() => {
    let vivo = true
    setRes(null)
    if (src) processar(src).then((r) => vivo && setRes(r))
    return () => {
      vivo = false
    }
  }, [src])

  return (
    <div className={`overflow-hidden ${className}`} style={{ backgroundColor: res?.cor || fundo }}>
      {src && (
        <img
          src={res?.url || src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-contain transition-opacity duration-300 ${res ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
