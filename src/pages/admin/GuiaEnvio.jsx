import { useEffect, useState } from 'react'
import { Copy, Check, ExternalLink, Package, MessageCircle, ChevronDown, CircleCheck, Circle, Loader2, Printer, Wallet, AlertCircle, Sparkles } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { formatarCep } from '../../store/entrega'
import { variacoesTexto } from '../../store/lojas'
import { PAGAMENTO_ONLINE } from '../../store/constants'
import { doacao, site } from '../../data/content'
import { acaoEnvio } from '../../lib/envio'

// Guia passo a passo para o dono da APHAM despachar um pedido "Envio pelos
// Correios". A etiqueta sai pelo próprio painel (api/envio.js → Melhor Envio):
// preparar, pagar com o saldo e imprimir, sem digitar nada no site do Melhor
// Envio. Se a automação falhar, o passo a passo manual continua disponível.

const PAINEL = 'https://melhorenvio.com.br/painel'
const PACOTE_PADRAO = { peso: 0.3, altura: 4, largura: 20, comprimento: 30 }
const SERVICOS = [
  ['1', 'Correios PAC'],
  ['2', 'Correios SEDEX'],
]
export const linkRastreio = (codigo) => `https://melhorrastreio.com.br/rastreio/${encodeURIComponent(codigo)}`

const num = (v, padrao) => (Number(v) > 0 ? Number(v) : padrao)
const fmtCpf = (v) => {
  const d = String(v || '').replace(/\D/g, '')
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return d
}

// Sugestão de caixa: soma os pesos e as alturas (itens empilhados) e usa a maior
// largura e o maior comprimento. Vale o que a balança e a fita métrica mostrarem.
function pacoteSugerido(itens, produtos, settings) {
  const padrao = Object.fromEntries(Object.entries(PACOTE_PADRAO).map(([k, v]) => [k, num(settings.fretePacote?.[k], v)]))
  let peso = 0, altura = 0, largura = 0, comprimento = 0
  for (const i of itens || []) {
    const p = produtos.find((x) => x.id === i.id) || {}
    const q = Number(i.qtd) || 1
    peso += num(p.peso, padrao.peso) * q
    altura += num(p.altura, padrao.altura) * q
    largura = Math.max(largura, num(p.largura, padrao.largura))
    comprimento = Math.max(comprimento, num(p.comprimento, padrao.comprimento))
  }
  return { peso: Math.round(peso * 1000) / 1000, altura: Math.min(Math.ceil(altura), 100), largura: Math.ceil(largura), comprimento: Math.ceil(comprimento) }
}

function Copiar({ rotulo, valor }) {
  const [ok, setOk] = useState(false)
  if (!valor) return null
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(String(valor))
      setOk(true)
      setTimeout(() => setOk(false), 1800)
    } catch {
      /* sem permissão: o texto continua na tela para copiar à mão */
    }
  }
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-navy-100 bg-white px-3 py-1.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">{rotulo}</p>
        <p className="whitespace-pre-line break-words text-sm font-medium text-navy-900">{valor}</p>
      </div>
      <button type="button" onClick={copiar} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-700 hover:bg-cyan-50 hover:text-cyan-700" aria-label={`Copiar ${rotulo}`}>
        {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {ok ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

const Painel = ({ children = 'Abrir o painel do Melhor Envio', href = PAINEL }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-600">
    {children}
    <ExternalLink className="h-3.5 w-3.5" />
  </a>
)

const MEDIDAS = [
  ['peso', 'Peso (kg)', '0.01'],
  ['altura', 'Altura (cm)', '1'],
  ['largura', 'Largura (cm)', '1'],
  ['comprimento', 'Comprimento (cm)', '1'],
]

// Passo da etiqueta automática: preparar → pagar com o saldo → imprimir.
function EtiquetaAuto({ o, volume }) {
  const { atualizarPedidoLocal } = useStore()
  const et = o.etiqueta?.status && o.etiqueta.status !== 'cancelada' ? o.etiqueta : null
  const [saldo, setSaldo] = useState(null)
  const [cpf, setCpf] = useState(fmtCpf(o.cliente?.cpf))
  const [servico, setServico] = useState(o.freteServicoId || '1')
  const [ocupado, setOcupado] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    acaoEnvio('saldo')
      .then((j) => setSaldo(j.saldo))
      .catch(() => {})
  }, [])

  const rodar = async (acao, extra = {}) => {
    setOcupado(acao)
    setErro('')
    setAviso('')
    try {
      const j = await acaoEnvio(acao, { pedidoId: o.id, ...extra })
      if (j.pedido) atualizarPedidoLocal(o.id, j.pedido)
      if (j.saldo != null) setSaldo(j.saldo)
      if (j.aviso) setAviso(j.aviso)
      if (acao === 'pagar' && j.pedido?.etiqueta?.url) window.open(j.pedido.etiqueta.url, '_blank', 'noopener')
    } catch (e) {
      setErro(e.message)
    } finally {
      setOcupado('')
    }
  }

  const preparar = () => rodar('preparar', { volume, cpf: cpf.replace(/\D/g, ''), servicoId: servico })
  const cancelar = () => {
    const pago = et && et.status !== 'carrinho'
    if (window.confirm(pago ? 'Cancelar esta etiqueta? O valor volta para o saldo do Melhor Envio (só funciona antes de postar).' : 'Descartar esta etiqueta (ainda não paga)?')) rodar('cancelar')
  }
  const semSaldo = et?.status === 'carrinho' && saldo != null && et.preco != null && saldo < et.preco
  const Botao = ({ acao, onClick, children, cor = 'bg-navy-800 hover:bg-navy-900', disabled }) => (
    <button type="button" onClick={onClick} disabled={Boolean(ocupado) || disabled} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 ${cor}`}>
      {ocupado === acao ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  )

  return (
    <div className="space-y-3">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-600">
        <Wallet className="h-3.5 w-3.5 text-cyan-600" />
        Saldo no Melhor Envio: {saldo == null ? '—' : <strong className="text-navy-900">{formatBRL(saldo)}</strong>}
      </p>

      {!et && (
        <>
          <p>
            Com o pacote pesado e medido (passo anterior), o site monta a etiqueta sozinho com os dados do cliente. Nada é cobrado ainda: primeiro você vê o preço.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-navy-600">
              Serviço
              <select value={servico} onChange={(e) => setServico(e.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900">
                {SERVICOS.map(([id, nome]) => (
                  <option key={id} value={id}>
                    {nome}
                    {id === o.freteServicoId ? ' (o cliente escolheu)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-navy-600">
              CPF de quem recebe
              <input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="000.000.000-00" className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900" />
            </label>
          </div>
          {!o.cliente?.cpf && <p className="text-xs font-semibold text-amber-700">Este pedido veio sem CPF: peça ao cliente pelo WhatsApp e digite acima.</p>}
          <Botao acao="preparar" onClick={preparar}>
            <Sparkles className="h-4 w-4" />
            Preparar etiqueta
          </Botao>
        </>
      )}

      {et?.status === 'carrinho' && (
        <div className="rounded-xl border border-navy-100 bg-white p-3">
          <p>
            Etiqueta pronta para pagar: <strong>{SERVICOS.find(([id]) => id === et.servicoId)?.[1] || 'Correios'}</strong> por{' '}
            <strong className="text-lg text-navy-900">{et.preco != null ? formatBRL(et.preco) : '—'}</strong>
            {o.frete > 0 && <span className="text-navy-500"> (o cliente pagou {formatBRL(o.frete)} de frete)</span>}.
          </p>
          {semSaldo && (
            <p className="mt-2 text-sm font-semibold text-amber-700">
              Falta saldo: coloque pelo menos {formatBRL(et.preco - saldo)} na carteira do Melhor Envio (Pix cai na hora) e clique em “Pagar” de novo.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Botao acao="pagar" onClick={() => rodar('pagar')} cor="bg-emerald-600 hover:bg-emerald-700">
              Pagar {et.preco != null ? formatBRL(et.preco) : ''} com o saldo e gerar
            </Botao>
            {semSaldo && <Painel>Colocar saldo</Painel>}
            <button type="button" onClick={cancelar} disabled={Boolean(ocupado)} className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-600 hover:bg-navy-50">
              Descartar
            </button>
          </div>
        </div>
      )}

      {et && et.status !== 'carrinho' && (
        <div className="rounded-xl border border-emerald-200 bg-white p-3">
          <p className="font-semibold text-emerald-800">
            ✓ Etiqueta paga{et.preco != null ? ` (${formatBRL(et.preco)})` : ''}
            {et.status === 'gerada' ? ' e pronta para imprimir.' : '. Gerando…'}
          </p>
          {et.rastreio && (
            <p className="mt-1 text-sm">
              Código de rastreio: <strong className="font-mono">{et.rastreio}</strong>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {et.url && et.status === 'gerada' ? (
              <a href={et.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600">
                <Printer className="h-4 w-4" />
                Abrir etiqueta para imprimir
              </a>
            ) : null}
            <Botao acao="imprimir" onClick={() => rodar('imprimir')} cor={et.url ? 'bg-navy-500 hover:bg-navy-600' : 'bg-cyan-500 hover:bg-cyan-600'}>
              <Printer className="h-4 w-4" />
              {et.url ? 'Gerar o link de novo' : 'Imprimir etiqueta'}
            </Botao>
            <Botao acao="atualizar" onClick={() => rodar('atualizar')} cor="bg-navy-500 hover:bg-navy-600">
              Buscar rastreio
            </Botao>
            <button type="button" onClick={cancelar} disabled={Boolean(ocupado)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Cancelar etiqueta
            </button>
          </div>
        </div>
      )}

      {aviso && <p className="text-sm font-semibold text-amber-700">{aviso}</p>}
      {erro && (
        <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{erro}</p>
        </div>
      )}
    </div>
  )
}

export default function GuiaEnvio({ o }) {
  const { produtos, settings, updateOrder } = useStore()
  const [aberto, setAberto] = useState(!o.rastreio)
  const [primeiraVez, setPrimeiraVez] = useState(false)
  const [manual, setManual] = useState(false)
  const [codigo, setCodigo] = useState(o.rastreio || o.etiqueta?.rastreio || '')
  const sugerido = pacoteSugerido(o.itens, produtos, settings)
  const [volume, setVolume] = useState(o.etiqueta?.volume || sugerido)
  useEffect(() => {
    if (!codigo && o.etiqueta?.rastreio) setCodigo(o.etiqueta.rastreio)
  }, [o.etiqueta?.rastreio]) // eslint-disable-line react-hooks/exhaustive-deps
  const feitos = o.envioPassos || []
  const marcar = (id) => updateOrder(o.id, { envioPassos: feitos.includes(id) ? feitos.filter((x) => x !== id) : [...feitos, id] })

  const end = o.enderecoDetalhado || {}
  const valorItens = (o.itens || []).reduce((s, i) => s + i.preco * i.qtd, 0)
  const servico = o.freteServico || ''
  const cepOrigem = formatarCep(settings.remetente?.cep || settings.freteCepOrigem || '68800000')
  const pagoOnline = o.pagamento === 'online' && o.pagamentoOnline?.status === 'aprovado'
  const conteudo = (o.itens || []).map((i) => `${i.qtd}x ${i.nome}${variacoesTexto(i) ? ` (${variacoesTexto(i, ', ')})` : ''} — ${formatBRL(i.preco * i.qtd)}`).join('\n')
  const etiquetaPronta = o.etiqueta?.status === 'gerada'

  const salvarRastreio = () => {
    const c = codigo.trim().toUpperCase()
    if (!c) return
    setCodigo(c)
    updateOrder(o.id, { rastreio: c, envioPassos: [...new Set([...feitos, 'postar'])], ...(['recebido', 'confirmado', 'preparo'].includes(o.status) ? { status: 'rota' } : {}) })
  }
  const mensagem = `Olá, ${(o.cliente?.nome || '').split(' ')[0]}! Seu pedido ${o.numero} da Loja APHAM foi postado nos Correios. 📦\n\nCódigo de rastreio: ${o.rastreio}\nAcompanhe aqui: ${linkRastreio(o.rastreio || '')}\n\nObrigado por apoiar a APHAM! 🤾`
  const wpp = `https://wa.me/55${(o.cliente?.telefone || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')}?text=${encodeURIComponent(mensagem)}`

  const passos = [
    {
      id: 'pagamento',
      titulo: 'Confira se o pagamento caiu',
      corpo: (
        <>
          {o.pagamento === 'online' ? (
            <p>
              Pagamento pelo Mercado Pago:{' '}
              <strong className={pagoOnline ? 'text-emerald-700' : 'text-amber-700'}>{PAGAMENTO_ONLINE[o.pagamentoOnline?.status] || 'aguardando'}</strong>.{' '}
              {pagoOnline ? 'Pode seguir.' : 'Só envie depois que aparecer “pago”.'}
            </p>
          ) : (
            <p>Pagamento manual: confira no extrato se o Pix de {formatBRL(o.total)} caiu antes de enviar.</p>
          )}
          <p className="mt-1">O cliente pagou <strong>{formatBRL(o.frete || 0)}</strong> de frete junto com o pedido. É esse dinheiro que paga a etiqueta.</p>
        </>
      ),
    },
    {
      id: 'embalar',
      titulo: 'Embale, pese e meça o pacote',
      corpo: (
        <>
          <ul className="list-disc space-y-0.5 pl-5">
            {(o.itens || []).map((i, k) => (
              <li key={k}>
                {i.qtd}x {i.nome}
                {variacoesTexto(i) && <span className="text-navy-500"> ({variacoesTexto(i, ', ')})</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Use uma caixa ou envelope resistente. Depois de fechar, <strong>pese</strong> e <strong>meça</strong> o pacote e corrija os números abaixo (já vêm com uma sugestão pelo cadastro dos produtos):
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MEDIDAS.map(([k, rotulo, passo]) => (
              <label key={k} className="text-xs font-semibold text-navy-600">
                {rotulo}
                <input
                  type="number"
                  min="0"
                  step={passo}
                  value={volume[k] ?? ''}
                  onChange={(e) => setVolume((v) => ({ ...v, [k]: e.target.value === '' ? '' : Number(e.target.value) }))}
                  disabled={Boolean(o.etiqueta?.status && o.etiqueta.status !== 'cancelada')}
                  className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 disabled:bg-navy-50"
                />
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-navy-500">Peso e tamanho mudam o preço: pacote menor e mais leve sai mais barato.</p>
        </>
      ),
    },
    {
      id: 'etiqueta',
      titulo: 'Gere a etiqueta (automático)',
      feito: etiquetaPronta,
      corpo: <EtiquetaAuto o={o} volume={volume} />,
    },
    {
      id: 'imprimir',
      titulo: 'Imprima e cole a etiqueta',
      corpo: (
        <>
          <p>
            Clique em <strong>Abrir etiqueta para imprimir</strong> (passo anterior) e imprima. Junto sai a <strong>declaração de conteúdo</strong>.
          </p>
          <p className="mt-1">
            Cole a <strong>etiqueta</strong> bem esticada na maior face do pacote, sem fita por cima do código de barras. Assine a <strong>declaração</strong> e cole junto, num saquinho plástico ou por fora.
          </p>
          <p className="mt-1 text-navy-500">Sem impressora? Abra o link no celular, salve o PDF e imprima numa gráfica ou papelaria.</p>
        </>
      ),
    },
    {
      id: 'postar',
      titulo: 'Leve o pacote à agência dos Correios',
      corpo: (
        <p>
          Entregue o pacote no balcão da agência dos Correios de Breves e diga que a etiqueta <strong>já está paga</strong>. Você <strong>não paga nada</strong> lá. Guarde o comprovante de postagem.
        </p>
      ),
    },
  ]
  const total = passos.length
  const estaFeito = (p) => p.feito || feitos.includes(p.id)
  const prontos = passos.filter(estaFeito).length

  return (
    <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/60">
      <button type="button" onClick={() => setAberto((a) => !a)} className="flex w-full items-center gap-3 p-4 text-left">
        <Package className="h-5 w-5 shrink-0 text-cyan-700" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-navy-900">Como enviar este pedido pelos Correios</p>
          <p className="text-xs text-navy-600">{o.rastreio ? `Enviado · rastreio ${o.rastreio}` : `${prontos} de ${total} passos feitos · etiqueta gerada aqui mesmo`}</p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${aberto ? 'rotate-180' : ''}`} />
      </button>

      {aberto && (
        <div className="border-t border-cyan-200 p-4 text-sm text-navy-700">
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(prontos / total) * 100}%` }} />
          </div>

          <div className="mb-4 rounded-xl border border-navy-100 bg-white">
            <button type="button" onClick={() => setPrimeiraVez((v) => !v)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-navy-800">
              Antes do primeiro envio (só uma vez)
              <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${primeiraVez ? 'rotate-180' : ''}`} />
            </button>
            {primeiraVez && (
              <div className="space-y-2 border-t border-navy-100 px-3 py-3 text-sm">
                <p>
                  1. Em <strong>Configurações → Frete pelos Correios</strong> aqui no painel, preencha o <strong>Remetente</strong> (endereço da APHAM, CNPJ e telefone). Ele vai em todas as etiquetas.
                </p>
                <p>
                  2. Coloque saldo na <strong>carteira do Melhor Envio</strong> (Pix). Cada etiqueta é paga com esse saldo, e o dinheiro do frete que o cliente pagou fica no Mercado Pago da APHAM para repor.
                </p>
                <Painel />
              </div>
            )}
          </div>

          <ol className="space-y-3">
            {passos.map((p, k) => {
              const ok = estaFeito(p)
              return (
                <li key={p.id} className={`rounded-xl border p-3 ${ok ? 'border-emerald-200 bg-emerald-50/60' : 'border-navy-100 bg-white'}`}>
                  <button type="button" onClick={() => !p.feito && marcar(p.id)} className="flex w-full items-start gap-2 text-left">
                    {ok ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-navy-300" />}
                    <span className={`font-semibold ${ok ? 'text-emerald-800' : 'text-navy-900'}`}>
                      Passo {k + 1}. {p.titulo}
                    </span>
                    {p.feito === undefined && <span className="ml-auto shrink-0 text-xs text-navy-400">{ok ? 'feito ✓' : 'marcar como feito'}</span>}
                  </button>
                  <div className={`mt-2 pl-7 ${ok && p.id !== 'etiqueta' ? 'opacity-70' : ''}`}>{p.corpo}</div>
                </li>
              )
            })}

            <li className={`rounded-xl border p-3 ${o.rastreio ? 'border-emerald-200 bg-emerald-50/60' : 'border-navy-100 bg-white'}`}>
              <p className={`flex items-start gap-2 font-semibold ${o.rastreio ? 'text-emerald-800' : 'text-navy-900'}`}>
                {o.rastreio ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-navy-300" />}
                Passo {total + 1}. Depois de postar, salve o rastreio e avise o cliente
              </p>
              <div className="mt-2 pl-7">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex.: AB123456789BR"
                    className="min-w-0 flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 font-mono text-sm uppercase outline-none focus:border-cyan-500"
                    aria-label="Código de rastreio"
                  />
                  <button type="button" onClick={salvarRastreio} className="rounded-lg bg-navy-800 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-900">
                    Salvar código
                  </button>
                </div>
                <p className="mt-1 text-xs text-navy-500">
                  {o.etiqueta?.rastreio && !o.rastreio ? 'O código já veio da etiqueta. ' : ''}Ao salvar, o pedido passa para “Em rota de entrega” e o código aparece para o cliente em “Acompanhar pedido”.
                </p>
                {o.rastreio && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {o.cliente?.telefone && (
                      <a href={wpp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
                        <MessageCircle className="h-4 w-4" />
                        Mandar o rastreio pelo WhatsApp
                      </a>
                    )}
                    <a href={linkRastreio(o.rastreio)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700 hover:bg-navy-50">
                      Ver o rastreio
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
                <p className="mt-3 text-xs text-navy-500">Quando o rastreio mostrar “Objeto entregue”, mude o status do pedido para “Entregue”.</p>
              </div>
            </li>
          </ol>

          {/* Plano B: tudo à mão no site do Melhor Envio. */}
          <div className="mt-4 rounded-xl border border-navy-100 bg-white">
            <button type="button" onClick={() => setManual((v) => !v)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-navy-700">
              Se a etiqueta automática não funcionar: fazer à mão no site do Melhor Envio
              <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${manual ? 'rotate-180' : ''}`} />
            </button>
            {manual && (
              <div className="space-y-3 border-t border-navy-100 px-3 py-3 text-sm">
                <p>
                  1. Abra o painel, clique em <strong>Calcular frete</strong> e preencha com os dados abaixo. Escolha <strong className="text-cyan-700">{servico || 'o serviço que o cliente escolheu'}</strong>.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Copiar rotulo="CEP de origem (APHAM)" valor={cepOrigem} />
                  <Copiar rotulo="CEP de destino (cliente)" valor={formatarCep(end.cep)} />
                  <Copiar rotulo="Peso (kg)" valor={String(volume.peso).replace('.', ',')} />
                  <Copiar rotulo="Medidas (A × L × C, cm)" valor={`${volume.altura} × ${volume.largura} × ${volume.comprimento}`} />
                  <Copiar rotulo="Valor dos produtos (R$)" valor={valorItens.toFixed(2).replace('.', ',')} />
                </div>
                <p>2. Dados de quem recebe:</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Copiar rotulo="Nome" valor={o.cliente?.nome} />
                  <Copiar rotulo="CPF" valor={fmtCpf(o.cliente?.cpf)} />
                  <Copiar rotulo="Telefone" valor={o.cliente?.telefone} />
                  <Copiar rotulo="E-mail" valor={o.cliente?.email} />
                  <Copiar rotulo="CEP" valor={formatarCep(end.cep)} />
                  <Copiar rotulo="Rua" valor={end.rua} />
                  <Copiar rotulo="Número" valor={end.numero} />
                  <Copiar rotulo="Complemento" valor={end.complemento} />
                  <Copiar rotulo="Bairro" valor={end.bairro} />
                  <Copiar rotulo="Cidade" valor={end.cidade} />
                  <Copiar rotulo="Estado (UF)" valor={end.uf} />
                </div>
                {!end.cep && o.endereco && <Copiar rotulo="Endereço completo" valor={o.endereco} />}
                <p>
                  3. Marque <strong>Declaração de conteúdo</strong> e descreva:
                </p>
                <Copiar rotulo="Conteúdo do pacote" valor={conteudo} />
                <p>
                  4. Remetente (se pedir): <span className="text-navy-500">{doacao.titular} · CNPJ {doacao.cnpj} · {settings.endereco || site.endereco}</span>
                </p>
                <p>
                  5. <strong>Adicionar ao carrinho</strong> → <strong>Carrinho</strong> → <strong>Pagar</strong> com o saldo → <strong>Etiquetas</strong> → <strong>Imprimir</strong>.
                </p>
                <Painel />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
