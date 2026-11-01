import { supabaseOk } from './_lib/supabase.js'
import { mpOk } from './_lib/mercadopago.js'
import { montarPedido, salvarPedido } from './_lib/pedido.js'

// Cria o pedido da loja para pagamento pelo site (Mercado Pago). Os valores são
// recalculados aqui, a partir do banco; o navegador manda só os itens e os dados.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })
  if (!supabaseOk() || !mpOk()) return res.status(503).json({ ok: false, erro: 'Pagamento online ainda não configurado.' })
  try {
    const r = await montarPedido(req.body || {})
    if (r.erro) return res.status(400).json({ ok: false, erro: r.erro })
    const esperado = Number(req.body?.totalEsperado)
    if (Number.isFinite(esperado) && Math.abs(esperado - r.pedido.total) > 0.01) {
      return res.status(409).json({ ok: false, erro: 'Os valores do carrinho mudaram. Confira o total e tente de novo.', total: r.pedido.total })
    }
    await salvarPedido(r.pedido, r.lojaIds)
    return res.status(200).json({ ok: true, pedido: r.pedido })
  } catch (e) {
    console.error('pedido', e)
    return res.status(500).json({ ok: false, erro: 'Não foi possível registrar o pedido. Tente de novo.' })
  }
}
