import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Check, ShoppingBag, Tag, X } from 'lucide-react'
import { useStore, novoId } from '../store/StoreContext'
import { site } from '../data/content'
import { useToast } from '../components/Toast'
import { notifyEmail } from '../lib/notify'
import { formatBRL } from '../store/format'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import OrderTimeline from '../components/store/OrderTimeline'
import PixBox from '../components/store/PixBox'

export default function Checkout() {
  const { cart, cartTotal, settings, addOrder, clearCart, aplicarCupom, baixarEstoque } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    entrega: 'retirada',
    endereco: '',
    pagamento: settings.pixChave ? 'pix' : 'whatsapp',
    obs: '',
  })
  const [cupomInput, setCupomInput] = useState('')
  const [cupom, setCupom] = useState(null) // { codigo, desconto }
  const [pedido, setPedido] = useState(null)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const subtotal = cartTotal
  const desconto = cupom ? cupom.desconto : 0
  const frete = useMemo(() => {
    if (form.entrega !== 'entrega') return 0
    const taxa = Number(settings.entregaTaxa) || 0
    const gratisAcima = settings.entregaGratisAcima
    if (gratisAcima != null && gratisAcima !== '' && subtotal >= Number(gratisAcima)) return 0
    return taxa
  }, [form.entrega, settings.entregaTaxa, settings.entregaGratisAcima, subtotal])
  const total = Math.max(0, subtotal - desconto) + frete

  const aplicar = () => {
    const r = aplicarCupom(cupomInput, subtotal)
    if (r.ok) {
      setCupom({ codigo: r.cupom.codigo, desconto: r.desconto })
      toast('Cupom aplicado!')
    } else {
      setCupom(null)
      toast(r.motivo || 'Cupom inválido.', 'erro')
    }
  }

  const montarTexto = (order) => {
    const linhas = order.itens.map(
      (i) => `• ${i.qtd}x ${i.nome}${i.tamanho || i.cor ? ` (${[i.tamanho, i.cor].filter(Boolean).join(', ')})` : ''} — ${formatBRL(i.preco * i.qtd)}`
    )
    return [
      `*Novo pedido — ${settings.nomeLoja}*`,
      `Pedido: ${order.numero}`,
      '',
      '*Itens:*',
      ...linhas,
      '',
      `Subtotal: ${formatBRL(order.subtotal)}`,
      order.desconto ? `Desconto (${order.cupomCodigo}): -${formatBRL(order.desconto)}` : '',
      `Entrega: ${order.frete ? formatBRL(order.frete) : order.entrega === 'entrega' ? 'a combinar' : 'Retirada'}`,
      `*Total: ${formatBRL(order.total)}*`,
      '',
      `*Cliente:* ${order.cliente.nome}`,
      `*Telefone:* ${order.cliente.telefone}`,
      order.cliente.email ? `*E-mail:* ${order.cliente.email}` : '',
      `*Entrega:* ${order.entrega === 'entrega' ? 'Entrega' : 'Retirada'}`,
      order.entrega === 'entrega' && order.endereco ? `*Endereço:* ${order.endereco}` : '',
      `*Pagamento:* ${order.pagamento === 'pix' ? 'PIX' : 'A combinar'}`,
      order.obs ? `*Obs:* ${order.obs}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  }

  // Usa o número oficial da APHAM (fonte única no site); cai no da loja só se faltar.
  const numeroPedido = (site.whatsappNumero || settings.whatsapp || '').replace(/\D/g, '')
  const linkWhatsApp = (order) => `https://wa.me/${numeroPedido}?text=${encodeURIComponent(montarTexto(order))}`

  const handleSubmit = (e) => {
    e.preventDefault()
    if (e.target.website && e.target.website.value) return // honeypot anti-spam
    if (!cart.length) return
    const order = {
      id: novoId('order'),
      numero: 'APHAM-' + Date.now().toString().slice(-6),
      data: new Date().toISOString(),
      cliente: { nome: form.nome, telefone: form.telefone, email: form.email },
      itens: cart,
      subtotal,
      desconto,
      cupomCodigo: cupom?.codigo || '',
      frete,
      total,
      entrega: form.entrega,
      endereco: form.endereco,
      pagamento: form.pagamento,
      obs: form.obs,
      status: 'recebido',
    }
    addOrder(order)
    baixarEstoque(cart)
    notifyEmail({ assunto: `Novo pedido ${order.numero} — ${formatBRL(order.total)}`, texto: montarTexto(order) })
    const url = linkWhatsApp(order)
    setPedido({ ...order, url })
    clearCart()
    window.open(url, '_blank', 'noopener')
  }

  // ----- Confirmação -----
  if (pedido) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <div className="container-x section-pad flex-1 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <Check className="h-8 w-8" />
              </span>
              <h1 className="mt-6 font-display text-2xl font-extrabold text-navy-900">Pedido recebido!</h1>
              <p className="mt-2 text-navy-600">
                Pedido <strong>{pedido.numero}</strong> · Total {formatBRL(pedido.total)}
              </p>
              <a href={pedido.url} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6">
                <MessageCircle className="h-4 w-4" />
                Enviar pedido no WhatsApp
              </a>
            </div>

            {pedido.pagamento === 'pix' && settings.pixChave && (
              <div className="mt-8">
                <PixBox chave={settings.pixChave} nome={settings.pixNome} cidade={settings.pixCidade} valor={pedido.total} txid={pedido.numero} />
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="mb-4 font-display font-bold text-navy-900">Acompanhe seu pedido</h2>
              <OrderTimeline status={pedido.status} />
              <Link to={`/pedido/${pedido.numero}`} className="btn-ghost mt-2 w-full">
                Acompanhar pedido
              </Link>
            </div>

            <Link to="/loja" className="mt-6 block text-center text-sm font-medium text-navy-600 hover:text-cyan-700">
              Voltar à loja
            </Link>
          </div>
        </div>
        <StoreFooter />
      </div>
    )
  }

  if (!cart.length) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <div className="container-x section-pad flex flex-1 flex-col items-center justify-center gap-5 py-24 text-center">
          <ShoppingBag className="h-10 w-10 text-navy-300" />
          <p className="text-navy-600">Seu carrinho está vazio.</p>
          <Link to="/loja" className="btn-accent">Ver produtos</Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl border border-navy-200 bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100'

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />
      <div className="container-x section-pad flex-1 py-10">
        <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Finalizar pedido</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="font-display font-bold text-navy-900">Seus dados</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy-800">Nome *</label>
                  <input name="nome" required value={form.nome} onChange={onChange} className={inputCls} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-navy-800">WhatsApp / Telefone *</label>
                  <input name="telefone" required value={form.telefone} onChange={onChange} className={inputCls} placeholder="(91) 9....." />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-navy-800">E-mail (opcional)</label>
                  <input name="email" type="email" value={form.email} onChange={onChange} className={inputCls} placeholder="voce@email.com" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="font-display font-bold text-navy-900">Entrega</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { v: 'retirada', l: 'Retirar com a APHAM' },
                  { v: 'entrega', l: 'Receber em casa' },
                ].map((o) => (
                  <label key={o.v} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium ${form.entrega === o.v ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700'}`}>
                    <input type="radio" name="entrega" value={o.v} checked={form.entrega === o.v} onChange={onChange} className="sr-only" />
                    {o.l}
                  </label>
                ))}
              </div>
              {form.entrega === 'entrega' && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-semibold text-navy-800">Endereço</label>
                  <input name="endereco" value={form.endereco} onChange={onChange} className={inputCls} placeholder="Rua, nº, bairro, cidade" />
                </div>
              )}
              <p className="mt-3 text-xs text-navy-500">{settings.entregaInfo}</p>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="font-display font-bold text-navy-900">Pagamento</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {settings.pixChave && (
                  <label className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium ${form.pagamento === 'pix' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700'}`}>
                    <input type="radio" name="pagamento" value="pix" checked={form.pagamento === 'pix'} onChange={onChange} className="sr-only" />
                    PIX (na hora, pelo site)
                  </label>
                )}
                <label className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium ${form.pagamento === 'whatsapp' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700'}`}>
                  <input type="radio" name="pagamento" value="whatsapp" checked={form.pagamento === 'whatsapp'} onChange={onChange} className="sr-only" />
                  Combinar no WhatsApp
                </label>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-navy-800">Observações (opcional)</label>
                <textarea name="obs" rows={3} value={form.obs} onChange={onChange} className={`${inputCls} resize-none`} placeholder="Alguma observação sobre o pedido?" />
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
              <h2 className="font-display text-lg font-bold text-navy-900">Seu pedido</h2>
              <ul className="mt-4 space-y-3">
                {cart.map((i, idx) => (
                  <li key={idx} className="flex justify-between gap-3 text-sm">
                    <span className="text-navy-700">
                      {i.qtd}x {i.nome}
                      {(i.tamanho || i.cor) && <span className="block text-xs text-navy-400">{[i.tamanho, i.cor].filter(Boolean).join(' · ')}</span>}
                    </span>
                    <span className="font-semibold text-navy-900">{formatBRL(i.preco * i.qtd)}</span>
                  </li>
                ))}
              </ul>

              {/* Cupom */}
              <div className="mt-4 border-t border-navy-100 pt-4">
                {cupom ? (
                  <div className="flex items-center justify-between rounded-lg bg-cyan-50 px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-cyan-700"><Tag className="h-3.5 w-3.5" />{cupom.codigo}</span>
                    <button type="button" onClick={() => { setCupom(null); setCupomInput('') }} className="text-cyan-700 hover:text-cyan-900" aria-label="Remover cupom"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={cupomInput} onChange={(e) => setCupomInput(e.target.value)} placeholder="Cupom de desconto" className="min-w-0 flex-1 rounded-lg border border-navy-200 bg-paper px-3 py-2 text-sm outline-none focus:border-cyan-500" />
                    <button type="button" onClick={aplicar} className="rounded-lg bg-navy-800 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-900">Aplicar</button>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm">
                <div className="flex justify-between text-navy-600"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
                {desconto > 0 && <div className="flex justify-between text-cyan-700"><span>Desconto</span><span>-{formatBRL(desconto)}</span></div>}
                <div className="flex justify-between text-navy-600"><span>Entrega</span><span>{form.entrega === 'entrega' ? (frete > 0 ? formatBRL(frete) : 'Grátis') : 'Retirada'}</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-navy-100 pt-3">
                <span className="font-display font-bold text-navy-900">Total</span>
                <span className="font-display text-xl font-extrabold text-navy-900">{formatBRL(total)}</span>
              </div>

              <button type="submit" className="btn-accent mt-6 w-full">
                <MessageCircle className="h-4 w-4" />
                Finalizar pedido
              </button>
              <p className="mt-3 text-center text-xs text-navy-500">
                O pedido é registrado e enviado pelo WhatsApp para confirmar.
              </p>
            </div>
          </div>
        </form>
      </div>
      <StoreFooter />
    </div>
  )
}
