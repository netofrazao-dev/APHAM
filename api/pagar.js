import { supabaseOk, lerPedido } from './_lib/supabase.js'
import { mpOk, criarPagamento } from './_lib/mercadopago.js'
import { aplicarPagamento, resumoPublico } from './_lib/pedido.js'

// Paga um pedido já criado em /api/pedido, com os dados do formulário do
// Mercado Pago (Payment Brick). O valor cobrado é sempre o total salvo no banco.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })
  if (!supabaseOk() || !mpOk()) return res.status(503).json({ ok: false, erro: 'Pagamento online ainda não configurado.' })
  const { pedidoId, numero, formData = {} } = req.body || {}
  try {
    const row = pedidoId && (await lerPedido(pedidoId))
    if (!row || row.numero !== numero) return res.status(404).json({ ok: false, erro: 'Pedido não encontrado.' })
    const p = row.data
    if (p.pagamentoOnline?.status === 'aprovado') return res.status(200).json({ ok: true, ...resumoPublico(row) })
    if (row.status === 'cancelado') return res.status(400).json({ ok: false, erro: 'Este pedido foi cancelado.' })

    const pix = formData.payment_method_id === 'pix'
    const origem = process.env.SITE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`
    const [nome, ...sobrenome] = p.cliente.nome.split(' ')
    const pagamento = await criarPagamento({
      transaction_amount: p.total,
      description: `Pedido ${p.numero} — Loja APHAM`,
      payment_method_id: formData.payment_method_id,
      external_reference: row.id,
      notification_url: `${origem}/api/mp-webhook`,
      statement_descriptor: 'APHAM',
      payer: {
        email: formData.payer?.email || p.cliente.email,
        first_name: nome,
        last_name: sobrenome.join(' ') || undefined,
        ...(formData.payer?.identification?.number ? { identification: formData.payer.identification } : {}),
      },
      additional_info: {
        items: p.itens.map((i) => ({ id: i.id, title: i.nome, quantity: i.qtd, unit_price: i.preco })),
        payer: { first_name: nome, phone: { number: p.cliente.telefone } },
      },
      ...(pix
        ? { date_of_expiration: new Date(Date.now() + 30 * 60e3 - 3 * 3600e3).toISOString().replace('Z', '-03:00') }
        : { token: formData.token, installments: Number(formData.installments) || 1, issuer_id: formData.issuer_id || undefined }),
    })
    const atual = await aplicarPagamento(row, pagamento)
    const t = pagamento.point_of_interaction?.transaction_data
    return res.status(200).json({
      ok: true,
      ...resumoPublico(atual),
      statusDetalhe: pagamento.status_detail,
      pix: pix && t ? { codigo: t.qr_code, imagem: t.qr_code_base64, link: t.ticket_url, expira: pagamento.date_of_expiration } : null,
    })
  } catch (e) {
    console.error('pagar', e.status, e.detalhe || e)
    const msg = e.status && e.status < 500 ? 'O Mercado Pago não aceitou os dados do pagamento. Confira e tente de novo.' : 'Não foi possível processar o pagamento agora. Tente de novo.'
    return res.status(e.status && e.status < 500 ? 400 : 502).json({ ok: false, erro: msg })
  }
}
