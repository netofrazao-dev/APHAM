import crypto from 'node:crypto'

// API do Mercado Pago (Checkout Transparente). O Access Token fica só no
// Vercel (MP_ACCESS_TOKEN); o navegador usa apenas a Public Key.
const API = 'https://api.mercadopago.com'
export const mpOk = () => Boolean(process.env.MP_ACCESS_TOKEN)

async function mp(caminho, { method = 'GET', body, idempotencia } = {}) {
  const r = await fetch(`${API}${caminho}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...(idempotencia ? { 'X-Idempotency-Key': idempotencia } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    const e = new Error(data.message || `Mercado Pago ${r.status}`)
    e.status = r.status
    e.detalhe = data
    throw e
  }
  return data
}

export const criarPagamento = (body) => mp('/v1/payments', { method: 'POST', body, idempotencia: crypto.randomUUID() })
export const lerPagamento = (id) => mp(`/v1/payments/${encodeURIComponent(id)}`)

// Confere a assinatura do aviso (webhook) do Mercado Pago, quando a chave secreta
// estiver configurada (MP_WEBHOOK_SECRET). Mesmo sem ela, o status nunca vem do
// aviso: o servidor sempre consulta o pagamento direto na API.
export function assinaturaValida(req, dataId) {
  const segredo = process.env.MP_WEBHOOK_SECRET
  if (!segredo) return true
  const partes = Object.fromEntries(
    String(req.headers['x-signature'] || '')
      .split(',')
      .map((p) => p.trim().split('='))
      .filter((p) => p.length === 2)
  )
  if (!partes.ts || !partes.v1) return false
  const id = /^[a-z0-9]+$/i.test(dataId) ? String(dataId).toLowerCase() : dataId
  const manifesto = `id:${id};request-id:${req.headers['x-request-id'] || ''};ts:${partes.ts};`
  const esperado = crypto.createHmac('sha256', segredo).update(manifesto).digest('hex')
  const a = Buffer.from(esperado)
  const b = Buffer.from(String(partes.v1))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
