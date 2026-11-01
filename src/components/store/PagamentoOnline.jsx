import { useEffect, useRef, useState } from 'react'
import { Copy, Check, Loader2, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import { MP_PUBLIC_KEY, carregarMercadoPago, pagarPedido, statusPedido, motivoRecusa } from '../../lib/mercadopago'
import { formatBRL } from '../../store/format'

// Pagamento do pedido pelo Mercado Pago, dentro do site: formulário oficial do
// Mercado Pago (Pix, cartão de crédito e débito) e, no Pix, o QR Code com a
// confirmação automática assim que o pagamento cai.
export default function PagamentoOnline({ pedido, onAprovado, onPixGerado }) {
  const [fase, setFase] = useState('form') // form | pix | analise
  const [erro, setErro] = useState('')
  const [carregado, setCarregado] = useState(false)
  const [pix, setPix] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const aprovadoRef = useRef(onAprovado)
  aprovadoRef.current = onAprovado
  const pixRef = useRef(onPixGerado)
  pixRef.current = onPixGerado

  // Formulário do Mercado Pago (Payment Brick).
  useEffect(() => {
    let cancelado = false
    let controle = null
    carregarMercadoPago()
      .then(async (MercadoPago) => {
        if (cancelado) return
        const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' })
        controle = await mp.bricks().create('payment', 'mp-pagamento', {
          initialization: { amount: pedido.total, payer: { email: pedido.cliente.email } },
          customization: {
            paymentMethods: { creditCard: 'all', debitCard: 'all', bankTransfer: ['pix'], maxInstallments: 12 },
            visual: { style: { theme: 'default' } },
          },
          callbacks: {
            onReady: () => !cancelado && setCarregado(true),
            onError: (e) => console.warn('Mercado Pago', e),
            onSubmit: async ({ formData }) => {
              setErro('')
              try {
                const r = await pagarPedido({ pedidoId: pedido.id, numero: pedido.numero, formData })
                if (r.pagamento === 'aprovado') return aprovadoRef.current(r)
                if (r.pix) {
                  setPix(r.pix)
                  setFase('pix')
                  pixRef.current?.()
                  return
                }
                if (r.pagamento === 'em_analise' || r.pagamento === 'aguardando') return setFase('analise')
                setErro(motivoRecusa(r.statusDetalhe))
              } catch (e) {
                setErro(e.message)
              }
              throw new Error('pagamento não concluído') // devolve o formulário para tentar de novo
            },
          },
        })
        if (cancelado) controle.unmount()
      })
      .catch((e) => !cancelado && setErro(e.message))
    return () => {
      cancelado = true
      controle?.unmount?.()
    }
  }, [pedido])

  // Pix / análise: confere o status a cada 4 s até confirmar.
  useEffect(() => {
    if (fase === 'form') return
    let ativo = true
    const t = setInterval(async () => {
      try {
        const r = await statusPedido(pedido.id, pedido.numero)
        if (!ativo) return
        if (r.pagamento === 'aprovado') aprovadoRef.current(r)
        else if (['recusado', 'cancelado'].includes(r.pagamento)) {
          setErro(fase === 'pix' ? 'O Pix expirou ou foi cancelado. Gere um novo código.' : motivoRecusa())
          setFase('form')
        }
      } catch {
        /* tenta de novo no próximo ciclo */
      }
    }, 4000)
    return () => {
      ativo = false
      clearInterval(t)
    }
  }, [fase, pedido])

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(pix.codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      /* navegador sem permissão: o código continua visível para copiar à mão */
    }
  }

  return (
    <div>
      {erro && (
        <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{erro}</p>
        </div>
      )}

      <div className={fase === 'form' ? '' : 'hidden'}>
        {!carregado && !erro && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-navy-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Carregando o pagamento seguro do Mercado Pago…
          </div>
        )}
        <div id="mp-pagamento" />
      </div>

      {fase === 'pix' && pix && (
        <div className="rounded-2xl border border-navy-100 bg-white p-6 text-center">
          <h3 className="font-display text-lg font-bold text-navy-900">Pague com Pix</h3>
          <p className="mt-1 text-sm text-navy-600">
            Abra o app do seu banco, escolha <strong>Pix → Ler QR Code</strong> ou use o copia e cola.
          </p>
          {pix.imagem && (
            <img
              src={`data:image/png;base64,${pix.imagem}`}
              alt="QR Code do Pix"
              className="mx-auto mt-5 h-56 w-56 rounded-xl border border-navy-100 p-2"
            />
          )}
          <p className="mt-4 font-display text-2xl font-extrabold text-navy-900">{formatBRL(pedido.total)}</p>
          <div className="mx-auto mt-4 max-w-md">
            <p className="break-all rounded-xl bg-navy-50 p-3 text-left font-mono text-xs text-navy-700">{pix.codigo}</p>
            <button type="button" onClick={copiar} className="btn-accent mt-3 w-full">
              {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiado ? 'Código copiado!' : 'Copiar código Pix'}
            </button>
            {pix.link && (
              <a href={pix.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
                Abrir no Mercado Pago
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aguardando o pagamento — a confirmação aparece aqui sozinha
          </p>
          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-navy-500">
            <Clock className="h-3.5 w-3.5" />O código vale por 30 minutos.
          </p>
        </div>
      )}

      {fase === 'analise' && (
        <div className="rounded-2xl border border-navy-100 bg-white p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-600" />
          <h3 className="mt-4 font-display text-lg font-bold text-navy-900">Pagamento em análise</h3>
          <p className="mt-1 text-sm text-navy-600">
            O Mercado Pago está conferindo o pagamento. Isso costuma levar poucos minutos; você pode deixar esta tela
            aberta ou acompanhar depois pelo número do pedido.
          </p>
        </div>
      )}
    </div>
  )
}
