// Pagamento automático pelo Mercado Pago (Checkout Transparente / Payment Brick).
// Só a Public Key fica no navegador; o Access Token fica no servidor (Vercel).
// Sem VITE_MP_PUBLIC_KEY o checkout continua com as opções de antes (PIX/WhatsApp).
export const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || ''
export const pagamentoOnlineAtivo = Boolean(MP_PUBLIC_KEY)

let carregando = null
export function carregarMercadoPago() {
  if (window.MercadoPago) return Promise.resolve(window.MercadoPago)
  carregando ||= new Promise((ok, falha) => {
    const s = document.createElement('script')
    s.src = 'https://sdk.mercadopago.com/js/v2'
    s.onload = () => ok(window.MercadoPago)
    s.onerror = () => {
      carregando = null
      falha(new Error('Não foi possível carregar o Mercado Pago.'))
    }
    document.head.appendChild(s)
  })
  return carregando
}

async function api(caminho, opcoes) {
  const r = await fetch(caminho, opcoes)
  const data = await r.json().catch(() => ({}))
  if (!r.ok || data.ok === false) throw Object.assign(new Error(data.erro || 'Erro de conexão. Tente de novo.'), { data })
  return data
}

const post = (caminho, body) =>
  api(caminho, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const criarPedidoOnline = (dados) => post('/api/pedido', dados)
export const pagarPedido = (dados) => post('/api/pagar', dados)
export const statusPedido = (id, numero) =>
  api(`/api/pedido-status?id=${encodeURIComponent(id)}&numero=${encodeURIComponent(numero)}`)

// Motivos de recusa do cartão mais comuns, em português simples. Aceita o código
// com ou sem o prefixo "cc_rejected_" (API de Orders e API antiga).
const RECUSAS = {
  insufficient_amount: 'O cartão não tem limite suficiente.',
  bad_filled_security_code: 'O código de segurança (CVV) está incorreto.',
  bad_filled_date: 'A data de validade está incorreta.',
  bad_filled_card_number: 'O número do cartão está incorreto.',
  bad_filled_other: 'Algum dado do cartão está incorreto.',
  call_for_authorize: 'O banco pediu autorização: ligue para o seu banco e tente de novo.',
  card_disabled: 'O cartão está bloqueado. Fale com o seu banco.',
  duplicated_payment: 'Você já fez um pagamento igual. Confira antes de tentar de novo.',
  high_risk: 'O pagamento foi recusado por segurança. Tente outro cartão ou o Pix.',
  max_attempts: 'Limite de tentativas atingido. Tente outro cartão ou o Pix.',
  rejected_by_issuer: 'O banco do cartão recusou o pagamento. Tente outro cartão ou o Pix.',
}
export const motivoRecusa = (detalhe) =>
  RECUSAS[String(detalhe || '').replace(/^cc_rejected_/, '')] || 'O pagamento foi recusado. Tente outro cartão ou pague com Pix.'
