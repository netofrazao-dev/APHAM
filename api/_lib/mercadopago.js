import crypto from 'node:crypto'

// API de Orders do Mercado Pago (Checkout Transparente). O Access Token fica só
// no Vercel (MP_ACCESS_TOKEN); o navegador usa apenas a Public Key.
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
  // Pagamento recusado volta como 402, com a order (status "failed") em `data`.
  if (r.status === 402 && data?.data?.id) return data.data
  if (!r.ok) {
    const e = new Error(data.message || data.errors?.[0]?.message || `Mercado Pago ${r.status}`)
    e.status = r.status
    e.detalhe = data
    throw e
  }
  return data
}

export const criarOrder = (body) => mp('/v1/orders', { method: 'POST', body, idempotencia: crypto.randomUUID() })
export const lerOrder = (id) => mp(`/v1/orders/${encodeURIComponent(id)}`)

// Status da order → status do pagamento usado no site.
function statusDaOrder(o, pg) {
  const detalhe = o.status_detail || pg?.status_detail || ''
  switch (o.status) {
    case 'processed':
      return 'aprovado'
    case 'action_required':
      return detalhe === 'pending_challenge' ? 'em_analise' : 'aguardando' // Pix esperando o pagamento
    case 'failed':
      return 'recusado'
    case 'canceled':
    case 'cancelled':
    case 'expired':
      return 'cancelado'
    case 'refunded':
    case 'charged_back':
      return 'estornado'
    default:
      return 'em_analise' // created / processing / in_review
  }
}

// Resumo da order no formato que o resto do servidor usa.
export function normalizarOrder(o) {
  const pg = o.transactions?.payments?.[0] || {}
  const m = pg.payment_method || {}
  return {
    id: o.id,
    referencia: o.external_reference,
    status: statusDaOrder(o, pg),
    detalhe: pg.status_detail || o.status_detail || '',
    valor: Number(o.total_paid_amount || pg.paid_amount || 0) || Number(o.total_amount || 0),
    pago: Number(o.total_paid_amount || pg.paid_amount || 0),
    metodo: m.id,
    tipo: m.type,
    parcelas: m.installments,
    pix: m.qr_code ? { codigo: m.qr_code, imagem: m.qr_code_base64, link: m.ticket_url, expira: pg.date_of_expiration } : null,
  }
}

// Confere a assinatura do aviso (webhook) do Mercado Pago, quando a chave secreta
// estiver configurada (MP_WEBHOOK_SECRET). Mesmo sem ela, o status nunca vem do
// aviso: o servidor sempre consulta a order direto na API.
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
  const requestId = req.headers['x-request-id']
  const confere = (id) => {
    const manifesto = [id && `id:${id}`, requestId && `request-id:${requestId}`, `ts:${partes.ts}`].filter(Boolean).join(';') + ';'
    const esperado = Buffer.from(crypto.createHmac('sha256', segredo).update(manifesto).digest('hex'))
    const recebido = Buffer.from(String(partes.v1))
    return esperado.length === recebido.length && crypto.timingSafeEqual(esperado, recebido)
  }
  // Ids com letras (ex.: "ORD01...") podem vir assinados em minúsculas.
  return confere(String(dataId)) || confere(String(dataId).toLowerCase())
}
