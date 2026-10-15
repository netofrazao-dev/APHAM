// Otimiza as imagens em public/midia (reduz dimensões e comprime).
// Uso: node scripts/optimize-images.mjs
import sharp from 'sharp'
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = 'public/midia'

// Logo: PNG com transparência, reduzida para ~800px de largura.
async function optimizeLogo() {
  const p = join(ROOT, 'logo-apham.png')
  const buf = await readFile(p)
  const out = await sharp(buf)
    .resize({ width: 800, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer()
  await writeFile(p, out)
  return p
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files
}

async function optimizePhotos() {
  const files = await walk(ROOT)
  const results = []
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (f.endsWith('logo-apham.png')) continue
    if (!['.jpg', '.jpeg'].includes(ext)) continue
    const before = (await stat(f)).size
    const buf = await readFile(f)
    const img = sharp(buf)
    const meta = await img.metadata()
    const maxW = f.includes('/posters/') ? 1280 : 1600
    const out = await sharp(buf)
      .resize({ width: Math.min(meta.width || maxW, maxW), withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer()
    // só grava se ficou menor
    if (out.length < before) {
      await writeFile(f, out)
      results.push(`${f}: ${Math.round(before / 1024)}KB -> ${Math.round(out.length / 1024)}KB`)
    }
  }
  return results
}

const logo = await optimizeLogo()
const logoSize = (await stat(logo)).size
console.log(`logo: ${Math.round(logoSize / 1024)}KB`)
const res = await optimizePhotos()
res.forEach((r) => console.log(r))
console.log('done')
