import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Check, ShoppingBag, Tag, X, CreditCard, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useStore, novoId } from '../store/StoreContext'
import { site } from '../data/content'
import { useToast } from '../components/Toast'
import { notifyEmail } from '../lib/notify'
import { formatBRL } from '../store/format'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import OrderTimeline from '../components/store/OrderTimeline'
import PixBox from '../components/store/PixBox'
import PagamentoOnline from '../components/store/PagamentoOnline'
import { pagamentoOnlineAtivo, pagamentoOnlineDisponivel, criarPedidoOnline } from '../lib/mercadopago'
import { pixDaLoja } from '../store/pix'
import { variacoesTexto } from '../store/lojas'
import { ENTREGAS, precisaEndereco, enderecoVazio, enderecoTexto, rotuloEntrega, formatarCep, buscarCep, ehBreves } from '../store/entrega'
import { useFrete, prazoTexto } from '../store/frete'

export default function Checkout() {
  const {
    cart,
    cartTotal,
    settings,
    addOrder,
    clearCart,
    aplicarCupom,
    baixarEstoque,
    registrarPedidoLocal,
    atualizarPedidoLocal,
    enderecoEntrega,
    salvarEnderecoEntrega,
    isAdmin,
  } = useStore()
  const comPagamentoOnline = pagamentoOnlineDisponivel(isAdmin)
  const toast = useToast()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    // Com endereço salvo (faixa "Enviar para"), já começa com ele.
    entrega: enderecoEntrega?.cidade ? (ehBreves(enderecoEntrega) ? 'entrega' : 'envio') : 'retirada',
    end: { ...enderecoVazio(), ...(enderecoEntrega || {}) },
    pagamento: comPagamentoOnline ? 'online' : 'pix',
    obs: '',
  })
  const pix = pixDaLoja(settings)
  const [cupomInput, setCupomInput] = useState('')
  const [cupom, setCupom] = useState(null) // { codigo, desconto }
  const [pedido, setPedido] = useState(null)
  const [online, setOnline] = useState(null) // pedido criado no servidor, aguardando o pagamento
  const [enviando, setEnviando] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const setEnd = (campo, valor) => setForm((f) => ({ ...f, end: { ...f.end, [campo]: valor } }))
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cepNaoAchado, setCepNaoAchado] = useState(false)
  // CEP completo: preenche rua, bairro, cidade e UF (o cliente pode corrigir).
  const mudarCep = async (valor) => {
    const cep = formatarCep(valor)
    setEnd('cep', cep)
    setCepNaoAchado(false)
    if (cep.replace(/\D/g, '').length !== 8) return
    setBuscandoCep(true)
    const r = await buscarCep(cep)
    setBuscandoCep(false)
    if (!r) return setCepNaoAchado(true)
    setForm((f) => ({ ...f, end: { ...f.end, rua: r.rua || f.end.rua, bairro: r.bairro || f.end.bairro, cidade: r.cidade, uf: r.uf } }))
  }
  const comEndereco = precisaEndereco(form.entrega)
  const endereco = comEndereco ? enderecoTexto(form.end) : ''
  const envio = form.entrega === 'envio'
  const cepCompleto = form.end.cep.replace(/\D/g, '').length === 8

  // Envio pelo Brasil: opções do Melhor Envio para o CEP. Vem marcada a mais
  // barata; se a cotação muda, mantém a escolha quando ela ainda existe.
  const cotacao = useFrete(form.end.cep, cart, envio)
  const [freteServico, setFreteServico] = useState('')
  useEffect(() => {
    if (cotacao.opcoes.length && !cotacao.opcoes.some((o) => o.id === freteServico)) setFreteServico(cotacao.opcoes[0].id)
  }, [cotacao.opcoes, freteServico])
  const opcaoFrete = envio ? cotacao.opcoes.find((o) => o.id === freteServico) || null : null
  const freteACalcular = envio && !opcaoFrete

  const subtotal = cartTotal
  const desconto = cupom ? cupom.desconto : 0
  const frete = useMemo(() => {
    if (opcaoFrete) return opcaoFrete.preco
    if (form.entrega !== 'entrega') return 0
    const taxa = Number(settings.entregaTaxa) || 0
    const gratisAcima = settings.entregaGratisAcima
    if (gratisAcima != null && gratisAcima !== '' && subtotal >= Number(gratisAcima)) return 0
    return taxa
  }, [opcaoFrete, form.entrega, settings.entregaTaxa, settings.entregaGratisAcima, subtotal])
  const dadosFrete = opcaoFrete ? { freteServico: opcaoFrete.nome, freteServicoId: opcaoFrete.id, fretePrazo: opcaoFrete.prazo } : {}
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
      (i) =>
        `• ${i.qtd}x ${i.nome}${variacoesTexto(i) ? ` (${variacoesTexto(i, ', ')})` : ''}${i.lojaNome ? ` [Loja: ${i.lojaNome}]` : ''} — ${formatBRL(i.preco * i.qtd)}`
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
      `${order.entrega === 'envio' ? 'Frete' : 'Entrega'}: ${order.freteACalcular ? 'a calcular' : order.frete ? formatBRL(order.frete) : order.entrega === 'entrega' ? 'grátis' : 'Retirada'}`,
      `*Total: ${formatBRL(order.total)}*`,
      '',
      `*Cliente:* ${order.cliente.nome}`,
      `*Telefone:* ${order.cliente.telefone}`,
      order.cliente.email ? `*E-mail:* ${order.cliente.email}` : '',
      `*Entrega:* ${rotuloEntrega(order)}`,
      order.endereco ? `*Endereço:* ${order.endereco}` : '',
      `*Pagamento:* ${order.pagamento === 'pix' ? 'Pix (segue o comprovante)' : 'A combinar'}`,
      order.obs ? `*Obs:* ${order.obs}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  }

  // Usa o número oficial da APHAM (fonte única no site); cai no da loja só se faltar.
  const numeroPedido = (site.whatsappNumero || settings.whatsapp || '').replace(/\D/g, '')
  const linkWhatsApp = (order) => `https://wa.me/${numeroPedido}?text=${encodeURIComponent(montarTexto(order))}`

  // Pagamento automático (Mercado Pago): o servidor registra o pedido e refaz os
  // valores; depois o cliente paga na própria página.
  const iniciarPagamentoOnline = async () => {
    setEnviando(true)
    try {
      const { pedido: p } = await criarPedidoOnline({
        itens: cart.map(({ id, qtd, tamanho, cor }) => ({ id, qtd, tamanho, cor })),
        cliente: { nome: form.nome, telefone: form.telefone, email: form.email },
        entrega: form.entrega,
        endereco: form.end,
        freteServico: opcaoFrete?.id || '',
        obs: form.obs,
        cupom: cupom?.codigo || '',
        totalEsperado: total,
      })
      registrarPedidoLocal(p)
      setOnline(p)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast(err.message, 'erro')
      if (envio) cotacao.recarregar() // o frete pode ter mudado: mostra as opções atuais
    } finally {
      setEnviando(false)
    }
  }

  const pagamentoAprovado = (r) => {
    atualizarPedidoLocal(online.id, { status: r.status, pagamentoOnline: { status: 'aprovado' } })
    clearCart()
    setPedido({ ...online, status: r.status, pago: true })
    setOnline(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (e.target.website && e.target.website.value) return // honeypot anti-spam
    if (!cart.length) return
    if (comEndereco) salvarEnderecoEntrega(form.end) // lembra para a próxima compra
    if (form.pagamento === 'online') return iniciarPagamentoOnline()
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
      endereco,
      ...(comEndereco ? { enderecoDetalhado: form.end } : {}),
      ...dadosFrete,
      ...(freteACalcular ? { freteACalcular: true } : {}),
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
    // No Pix, o cliente paga primeiro e depois manda o comprovante pelo botão.
    if (order.pagamento !== 'pix') window.open(url, '_blank', 'noopener')
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
              <h1 className="mt-6 font-display text-2xl font-extrabold text-navy-900">
                {pedido.pago ? 'Pagamento aprovado!' : 'Pedido recebido!'}
              </h1>
              <p className="mt-2 text-navy-600">
                Pedido <strong>{pedido.numero}</strong> · Total {formatBRL(pedido.total)}
              </p>
              {pedido.pago && (
                <p className="mt-2 max-w-md text-sm text-navy-500">
                  A APHAM já recebeu a confirmação do pagamento e vai separar o seu pedido.
                  {pedido.cliente.email && ' O comprovante do Mercado Pago foi enviado para o seu e-mail.'}
                </p>
              )}
              {pedido.pagamento === 'pix' && (
                <p className="mt-2 max-w-md text-sm text-navy-500">
                  Pague com o Pix abaixo e depois envie o comprovante pelo WhatsApp. A APHAM confirma o pedido e combina a retirada ou a entrega.
                </p>
              )}
              {pedido.freteACalcular && (
                <p className="mt-3 max-w-md rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <strong>Frete:</strong> a APHAM calcula o envio para o seu CEP e manda o valor pelo WhatsApp, para pagar à parte.
                </p>
              )}
              {pedido.freteServico && (
                <p className="mt-3 max-w-md rounded-xl bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  <strong>Envio:</strong> {pedido.freteServico} · {formatBRL(pedido.frete)}
                  {pedido.fretePrazo ? ` · chega em ${prazoTexto(pedido.fretePrazo)}` : ''}.
                </p>
              )}
              {pedido.url && pedido.pagamento !== 'pix' && (
                <a href={pedido.url} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6">
                  <MessageCircle className="h-4 w-4" />
                  Enviar pedido no WhatsApp
                </a>
              )}
            </div>

            {pedido.pagamento === 'pix' && (
              <div className="mt-8">
                <PixBox chave={pix.chave} nome={pix.nome} cidade={pix.cidade} valor={pedido.total} txid={pedido.numero} />
                <a href={pedido.url} target="_blank" rel="noopener noreferrer" className="btn mt-4 w-full bg-[#25d366] text-white hover:bg-[#1ebe5b]">
                  <MessageCircle className="h-4 w-4" />
                  Já paguei: enviar pedido e comprovante no WhatsApp
                </a>
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

  // ----- Pagamento pelo Mercado Pago -----
  if (online) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <div className="container-x section-pad flex-1 py-10">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setOnline(null)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-cyan-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar e editar o pedido
            </button>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Pagamento</h1>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-navy-100 bg-white px-5 py-4">
              <p className="text-sm text-navy-600">
                Pedido <strong className="text-navy-900">{online.numero}</strong> · {online.itens.reduce((s, i) => s + i.qtd, 0)}{' '}
                {online.itens.reduce((s, i) => s + i.qtd, 0) === 1 ? 'item' : 'itens'}
              </p>
              <p className="font-display text-xl font-extrabold text-navy-900">{formatBRL(online.total)}</p>
            </div>
            <div className="mt-6">
              <PagamentoOnline pedido={online} onAprovado={pagamentoAprovado} onPixGerado={clearCart} />
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-navy-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Pagamento processado pelo Mercado Pago. Os dados do cartão não passam pelo site da APHAM.
            </p>
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
                  <label className="mb-1.5 block text-sm font-semibold text-navy-800">
                    E-mail {form.pagamento === 'online' ? '*' : '(opcional)'}
                  </label>
                  <input name="email" type="email" required={form.pagamento === 'online'} value={form.email} onChange={onChange} className={inputCls} placeholder="voce@email.com" />
                  {form.pagamento === 'online' && <p className="mt-1 text-xs text-navy-500">Para o comprovante do pagamento.</p>}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="font-display font-bold text-navy-900">Entrega</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ENTREGAS.map((o) => (
                  <label key={o.id} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${form.entrega === o.id ? 'border-cyan-500 bg-cyan-50 text-cyan-800' : 'border-navy-200 text-navy-700'}`}>
                    <input type="radio" name="entrega" value={o.id} checked={form.entrega === o.id} onChange={onChange} className="sr-only" />
                    <span className="block font-semibold">{o.rotulo}</span>
                    <span className="block text-xs opacity-75">{o.detalhe}</span>
                  </label>
                ))}
              </div>
              {comEndereco && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="cep" className="mb-1.5 block text-sm font-semibold text-navy-800">CEP {envio && '*'}</label>
                    <input id="cep" inputMode="numeric" autoComplete="postal-code" required={envio} value={form.end.cep} onChange={(e) => mudarCep(e.target.value)} className={inputCls} placeholder="00000-000" />
                    {buscandoCep && <p className="mt-1 text-xs text-navy-500">Buscando o endereço…</p>}
                    {cepNaoAchado && <p className="mt-1 text-xs text-amber-700">CEP não encontrado. Preencha o endereço à mão.</p>}
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="rua" className="mb-1.5 block text-sm font-semibold text-navy-800">Rua / avenida *</label>
                    <input id="rua" required autoComplete="address-line1" value={form.end.rua} onChange={(e) => setEnd('rua', e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="numero" className="mb-1.5 block text-sm font-semibold text-navy-800">Número *</label>
                    <input id="numero" required value={form.end.numero} onChange={(e) => setEnd('numero', e.target.value)} className={inputCls} placeholder="ou s/n" />
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="complemento" className="mb-1.5 block text-sm font-semibold text-navy-800">Complemento</label>
                    <input id="complemento" autoComplete="address-line2" value={form.end.complemento} onChange={(e) => setEnd('complemento', e.target.value)} className={inputCls} placeholder="Casa, apto, ponto de referência" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bairro" className="mb-1.5 block text-sm font-semibold text-navy-800">Bairro *</label>
                    <input id="bairro" required value={form.end.bairro} onChange={(e) => setEnd('bairro', e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="cidade" className="mb-1.5 block text-sm font-semibold text-navy-800">Cidade *</label>
                    <input id="cidade" required autoComplete="address-level2" value={form.end.cidade} onChange={(e) => setEnd('cidade', e.target.value)} className={inputCls} placeholder={form.entrega === 'entrega' ? 'Breves' : ''} />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="uf" className="mb-1.5 block text-sm font-semibold text-navy-800">UF *</label>
                    <input id="uf" required maxLength={2} autoComplete="address-level1" value={form.end.uf} onChange={(e) => setEnd('uf', e.target.value.toUpperCase())} className={inputCls} placeholder="PA" />
                  </div>
                </div>
              )}
              {envio && (cotacao.carregando || cotacao.opcoes.length > 0) && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-navy-800">Frete</p>
                  {cotacao.carregando ? (
                    <p className="inline-flex items-center gap-2 text-sm text-navy-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculando o frete para o seu CEP…
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {cotacao.opcoes.map((o) => (
                        <label
                          key={o.id}
                          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                            freteServico === o.id ? 'border-cyan-500 bg-cyan-50' : 'border-navy-200 hover:border-navy-300'
                          }`}
                        >
                          <input type="radio" name="freteServico" value={o.id} checked={freteServico === o.id} onChange={() => setFreteServico(o.id)} className="sr-only" />
                          <span>
                            <span className="block font-semibold text-navy-900">{o.nome}</span>
                            {o.prazo && <span className="block text-xs text-navy-500">Chega em {prazoTexto(o.prazo)}</span>}
                          </span>
                          <span className="shrink-0 font-display font-bold text-navy-900">{formatBRL(o.preco)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-navy-500">
                {!envio
                  ? settings.entregaInfo
                  : opcaoFrete
                    ? Number(settings.fretePrazoExtra ?? 2) > 0
                      ? 'O prazo já conta os dias para a APHAM separar e postar o seu pedido nos Correios.'
                      : 'Enviamos pelos Correios para todo o Brasil.'
                    : !cepCompleto
                      ? 'Informe o CEP para calcular o frete.'
                      : cotacao.carregando
                        ? ''
                        : 'Enviamos para todo o Brasil. O frete é calculado depois da compra, pelo seu CEP, e a APHAM informa o valor pelo WhatsApp para pagar à parte.'}
              </p>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6">
              <h2 className="font-display font-bold text-navy-900">Pagamento</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {comPagamentoOnline && (
                  <label className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium ${form.pagamento === 'online' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700'}`}>
                    <input type="radio" name="pagamento" value="online" checked={form.pagamento === 'online'} onChange={onChange} className="sr-only" />
                    <span className="inline-flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pix ou cartão — pagamento automático
                      {!pagamentoOnlineAtivo && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">teste · só o admin vê</span>}
                    </span>
                  </label>
                )}
                <label className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium ${form.pagamento === 'pix' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700'}`}>
                  <input type="radio" name="pagamento" value="pix" checked={form.pagamento === 'pix'} onChange={onChange} className="sr-only" />
                  Pix
                </label>
              </div>
              {form.pagamento === 'pix' && (
                <p className="mt-3 text-xs text-navy-500">
                  Ao finalizar, aparecem o QR Code e o Pix copia e cola. Depois de pagar, envie o comprovante pelo WhatsApp e a APHAM confirma o pedido.
                </p>
              )}
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
                      {variacoesTexto(i) && <span className="block text-xs text-navy-400">{variacoesTexto(i)}</span>}
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
                <div className="flex justify-between text-navy-600">
                  <span>{envio ? 'Frete' : 'Entrega'}</span>
                  <span>
                    {envio
                      ? opcaoFrete
                        ? formatBRL(frete)
                        : cotacao.carregando
                          ? 'calculando…'
                          : 'a calcular'
                      : form.entrega === 'entrega'
                        ? frete > 0
                          ? formatBRL(frete)
                          : 'Grátis'
                        : 'Retirada'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-navy-100 pt-3">
                <span className="font-display font-bold text-navy-900">{freteACalcular ? 'Total sem o frete' : 'Total'}</span>
                <span className="font-display text-xl font-extrabold text-navy-900">{formatBRL(total)}</span>
              </div>

              <button type="submit" disabled={enviando || (envio && cotacao.carregando)} className="btn-accent mt-6 w-full disabled:opacity-60">
                {enviando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : form.pagamento === 'online' ? (
                  <CreditCard className="h-4 w-4" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                {form.pagamento === 'online' ? 'Ir para o pagamento' : 'Finalizar pedido'}
              </button>
              <p className="mt-3 text-center text-xs text-navy-500">
                {form.pagamento === 'online'
                  ? 'Pague com Pix ou cartão pelo Mercado Pago. A confirmação é automática.'
                  : 'O pedido é registrado e, na próxima tela, aparece o Pix para pagar.'}
              </p>
            </div>
          </div>
        </form>
      </div>
      <StoreFooter />
    </div>
  )
}
