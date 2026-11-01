// Lê um arquivo de imagem e devolve um data URL JÁ REDIMENSIONADO/comprimido,
// para caber no armazenamento local do navegador (localStorage é limitado).
// No futuro, com backend (Supabase Storage), isto é substituído por upload real.
// Fotos com fundo transparente (PNG "recortado") não podem virar JPEG: o
// transparente ficaria preto. Essas saem em WebP, que mantém a transparência
// (o Safari, que não gera WebP, devolve PNG, que também mantém).
function temTransparencia(ctx, width, height) {
  const d = ctx.getImageData(0, 0, width, height).data
  for (let i = 3; i < d.length; i += 4) if (d[i] < 255) return true
  return false
}

export function fileToOptimizedDataURL(file, maxSize = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        try {
          const transparente = !/jpe?g/i.test(file.type) && temTransparencia(ctx, width, height)
          resolve(transparente ? canvas.toDataURL('image/webp', 0.85) : canvas.toDataURL('image/jpeg', quality))
        } catch (e) {
          reject(e)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
