import { supabaseOk, lerPedido } from './_lib/supabase.js'
import { mpOk, lerOrder, normalizarOrder, assinaturaValida } from './_lib/mercadopago.js'
import { aplicarPagamento } from './_lib/pedido.js'

// Aviso automático do Mercado Pago (webhook) quando uma order muda de status.
// Configure no painel do Mercado Pago: Suas integrações > aplicação > Webhooks >
// URL https://www.handebolmarajo.org/api/mp-webhook, evento "Order".
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const q = req.query || {}
  const corpo = req.body || {}
  const tipo = q.type || q.topic || corpo.type || corpo.topic
  const dataId = q['data.id'] || corpo.data?.id
  if (tipo !== 'order' || !dataId) return res.status(200).json({ ok: true, ignorado: true })
  if (!assinaturaValida(req, String(dataId))) return res.status(401).json({ ok: false })
  if (!supabaseOk() || !mpOk()) return res.status(200).json({ ok: false, motivo: 'não configurado' })
  try {
    const mp = normalizarOrder(await lerOrder(dataId))
    const row = mp.referencia && (await lerPedido(mp.referencia))
    if (row) await aplicarPagamento(row, mp)
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('mp-webhook', e)
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return res.status(500).json({ ok: false })
  }
}
