import { supabaseOk, lerPedido } from './_lib/supabase.js'
import { mpOk, lerOrder, normalizarOrder } from './_lib/mercadopago.js'
import { aplicarPagamento, resumoPublico } from './_lib/pedido.js'

const FINAIS = ['aprovado', 'recusado', 'cancelado', 'estornado']

// Status de um pedido (para a tela do Pix e o "Acompanhar pedido"). Pede o id e o
// número juntos. Se o pagamento ainda não terminou, confere direto no Mercado Pago
// (assim funciona mesmo que o aviso automático atrase).
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false })
  if (!supabaseOk()) return res.status(503).json({ ok: false })
  const { id, numero } = req.query || {}
  try {
    let row = id && (await lerPedido(String(id)))
    if (!row || row.numero !== numero) return res.status(404).json({ ok: false })
    const pg = row.data.pagamentoOnline
    if (mpOk() && pg?.id && !FINAIS.includes(pg.status)) row = await aplicarPagamento(row, normalizarOrder(await lerOrder(pg.id)))
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ ok: true, ...resumoPublico(row) })
  } catch (e) {
    console.error('pedido-status', e)
    return res.status(500).json({ ok: false })
  }
}
