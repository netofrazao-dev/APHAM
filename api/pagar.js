import { supabaseOk, lerPedido } from './_lib/supabase.js'
import { mpOk, criarOrder, normalizarOrder } from './_lib/mercadopago.js'
import { aplicarPagamento, resumoPublico } from './_lib/pedido.js'

const reais = (v) => Number(v).toFixed(2)

// Paga um pedido já criado em /api/pedido, com os dados do formulário do
// Mercado Pago (Payment Brick), pela API de Orders. O valor cobrado é sempre o
// total salvo no banco.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })
  if (!supabaseOk() || !mpOk()) return res.status(503).json({ ok: false, erro: 'Pagamento online ainda não configurado.' })
  const { pedidoId, numero, formData = {}, tipo } = req.body || {}
  try {
    const row = pedidoId && (await lerPedido(pedidoId))
    if (!row || row.numero !== numero) return res.status(404).json({ ok: false, erro: 'Pedido não encontrado.' })
    const p = row.data
    if (p.pagamentoOnline?.status === 'aprovado') return res.status(200).json({ ok: true, ...resumoPublico(row) })
    if (row.status === 'cancelado') return res.status(400).json({ ok: false, erro: 'Este pedido foi cancelado.' })

    const pix = formData.payment_method_id === 'pix'
    const [nome, ...sobrenome] = p.cliente.nome.split(' ')
    const identificacao = formData.payer?.identification
    const order = await criarOrder({
      type: 'online',
      processing_mode: 'automatic',
      total_amount: reais(p.total),
      external_reference: row.id,
      description: `Pedido ${p.numero} — Loja APHAM`,
      payer: {
        email: formData.payer?.email || p.cliente.email,
        first_name: nome,
        ...(sobrenome.length ? { last_name: sobrenome.join(' ') } : {}),
        ...(identificacao?.number ? { identification: { type: identificacao.type, number: String(identificacao.number) } } : {}),
      },
      items: [
        ...p.itens.map((i) => ({ title: i.nome, unit_price: reais(i.preco), quantity: i.qtd, external_code: String(i.id) })),
        ...(p.frete > 0
          ? [{ title: p.freteServico ? `Frete — ${p.freteServico}` : 'Entrega', unit_price: reais(p.frete), quantity: 1, external_code: 'frete' }]
          : []),
      ],
      transactions: {
        payments: [
          {
            amount: reais(p.total),
            ...(pix ? { expiration_time: 'PT30M' } : {}),
            payment_method: pix
              ? { id: 'pix', type: 'bank_transfer' }
              : {
                  id: formData.payment_method_id,
                  type: tipo === 'debit_card' ? 'debit_card' : 'credit_card',
                  token: formData.token,
                  installments: Number(formData.installments) || 1,
                  statement_descriptor: 'APHAM',
                },
          },
        ],
      },
    })
    const mp = normalizarOrder(order)
    const atual = await aplicarPagamento(row, mp)
    return res.status(200).json({ ok: true, ...resumoPublico(atual), statusDetalhe: mp.detalhe, pix: pix ? mp.pix : null })
  } catch (e) {
    console.error('pagar', e.status, JSON.stringify(e.detalhe || String(e)))
    const msg =
      e.status && e.status < 500
        ? 'O Mercado Pago não aceitou os dados do pagamento. Confira e tente de novo.'
        : 'Não foi possível processar o pagamento agora. Tente de novo.'
    return res.status(e.status && e.status < 500 ? 400 : 502).json({ ok: false, erro: msg })
  }
}
