import { useState } from 'react'
import { Copy, Check, ExternalLink, Package, MessageCircle, ChevronDown, CircleCheck, Circle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { formatarCep } from '../../store/entrega'
import { variacoesTexto } from '../../store/lojas'
import { PAGAMENTO_ONLINE } from '../../store/constants'
import { doacao, site } from '../../data/content'

// Guia passo a passo para o dono da APHAM despachar um pedido "Envio pelos
// Correios" usando o painel do Melhor Envio: com os dados do pedido prontos para
// copiar, uma lista para marcar o que já foi feito e o código de rastreio, que
// vai para o cliente pelo WhatsApp e aparece no "Acompanhar pedido".

const PAINEL = 'https://melhorenvio.com.br/painel'
const PACOTE_PADRAO = { peso: 0.3, altura: 4, largura: 20, comprimento: 30 }
export const linkRastreio = (codigo) => `https://melhorrastreio.com.br/rastreio/${encodeURIComponent(codigo)}`

const num = (v, padrao) => (Number(v) > 0 ? Number(v) : padrao)
const fmtCpf = (v) => {
  const d = String(v || '').replace(/\D/g, '')
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return d
}

// Sugestão de caixa: soma os pesos e as alturas (itens empilhados) e usa a maior
// largura e o maior comprimento. É só um ponto de partida: vale o que a balança e
// a fita métrica mostrarem.
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
        <p className="break-words text-sm font-medium text-navy-900">{valor}</p>
      </div>
      <button type="button" onClick={copiar} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-700 hover:bg-cyan-50 hover:text-cyan-700" aria-label={`Copiar ${rotulo}`}>
        {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {ok ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

const Painel = ({ children = 'Abrir o painel do Melhor Envio' }) => (
  <a href={PAINEL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-600">
    {children}
    <ExternalLink className="h-3.5 w-3.5" />
  </a>
)

export default function GuiaEnvio({ o }) {
  const { produtos, settings, updateOrder } = useStore()
  const [aberto, setAberto] = useState(!o.rastreio)
  const [primeiraVez, setPrimeiraVez] = useState(false)
  const [codigo, setCodigo] = useState(o.rastreio || '')
  const feitos = o.envioPassos || []
  const marcar = (id) => updateOrder(o.id, { envioPassos: feitos.includes(id) ? feitos.filter((x) => x !== id) : [...feitos, id] })

  const end = o.enderecoDetalhado || {}
  const pacote = pacoteSugerido(o.itens, produtos, settings)
  const valorItens = (o.itens || []).reduce((s, i) => s + i.preco * i.qtd, 0)
  const servico = o.freteServico || ''
  const cepOrigem = formatarCep(settings.freteCepOrigem || '68800000')
  const pagoOnline = o.pagamento === 'online' && o.pagamentoOnline?.status === 'aprovado'
  const conteudo = (o.itens || []).map((i) => `${i.qtd}x ${i.nome}${variacoesTexto(i) ? ` (${variacoesTexto(i, ', ')})` : ''} — ${formatBRL(i.preco * i.qtd)}`).join('\n')

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
              {pagoOnline ? 'Pode seguir.' : 'Só envie depois que aparecer “aprovado”.'}
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
      titulo: 'Separe e embale os produtos',
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
            Use uma caixa ou envelope resistente. Depois de fechar, <strong>pese</strong> e <strong>meça</strong> o pacote (altura × largura × comprimento, em cm).
          </p>
          <p className="mt-1 text-navy-500">
            Sugestão pelo cadastro dos produtos: {pacote.peso} kg · {pacote.altura} × {pacote.largura} × {pacote.comprimento} cm. Se a balança mostrar outro peso, use o da balança.
          </p>
        </>
      ),
    },
    {
      id: 'saldo',
      titulo: 'Coloque saldo no Melhor Envio',
      corpo: (
        <>
          <p>
            No painel, entre em <strong>Carteira</strong> (ou <strong>Adicionar saldo</strong>) e coloque pelo menos <strong>{formatBRL(o.frete || 0)}</strong>. O Pix é o mais rápido e pode sair da conta do Mercado Pago da APHAM.
          </p>
          <p className="mt-1 text-navy-500">Se já tiver saldo de antes, pule este passo.</p>
          <div className="mt-2"><Painel /></div>
        </>
      ),
    },
    {
      id: 'cotar',
      titulo: 'Calcule o frete no painel e escolha o serviço',
      corpo: (
        <>
          <p>
            Clique em <strong>Calcular frete</strong> (ou <strong>Novo envio</strong>) e preencha:
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Copiar rotulo="CEP de origem (APHAM)" valor={cepOrigem} />
            <Copiar rotulo="CEP de destino (cliente)" valor={formatarCep(end.cep)} />
            <Copiar rotulo="Peso (kg)" valor={String(pacote.peso).replace('.', ',')} />
            <Copiar rotulo="Medidas (A × L × C, cm)" valor={`${pacote.altura} × ${pacote.largura} × ${pacote.comprimento}`} />
            <Copiar rotulo="Valor segurado (R$)" valor={valorItens.toFixed(2).replace('.', ',')} />
          </div>
          <p className="mt-2">
            Na lista de serviços, escolha <strong className="text-cyan-700">{servico || 'o mesmo que o cliente escolheu'}</strong>
            {o.fretePrazo ? ` (o cliente viu prazo de até ${o.fretePrazo} dias úteis)` : ''}. O preço deve ficar perto de {formatBRL(o.frete || 0)}.
          </p>
        </>
      ),
    },
    {
      id: 'destinatario',
      titulo: 'Preencha os dados de quem vai receber',
      corpo: (
        <>
          <p>Copie cada campo e cole no formulário do destinatário:</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
          {!o.cliente?.cpf && (
            <p className="mt-2 font-semibold text-amber-700">
              Este pedido não tem CPF. Peça o CPF ao cliente pelo WhatsApp: o Melhor Envio pede o documento de quem recebe.
            </p>
          )}
          {!end.cep && o.endereco && <Copiar rotulo="Endereço completo" valor={o.endereco} />}
        </>
      ),
    },
    {
      id: 'declaracao',
      titulo: 'Marque “Declaração de conteúdo”',
      corpo: (
        <>
          <p>
            Quando o painel perguntar sobre nota fiscal, escolha <strong>Declaração de conteúdo</strong> (é o certo para a APHAM, que não emite nota destes produtos). Descreva o que vai na caixa:
          </p>
          <div className="mt-2">
            <Copiar rotulo="Conteúdo do pacote" valor={conteudo} />
          </div>
        </>
      ),
    },
    {
      id: 'pagar',
      titulo: 'Coloque no carrinho e pague a etiqueta',
      corpo: (
        <p>
          Clique em <strong>Adicionar ao carrinho</strong>, abra o <strong>Carrinho</strong>, marque este envio e clique em <strong>Pagar</strong> usando o saldo da carteira.
        </p>
      ),
    },
    {
      id: 'imprimir',
      titulo: 'Imprima a etiqueta e a declaração',
      corpo: (
        <>
          <p>
            Em <strong>Etiquetas</strong> (ou <strong>Minhas etiquetas</strong>), clique em <strong>Imprimir</strong>. Saem a etiqueta e a declaração de conteúdo.
          </p>
          <p className="mt-1">
            Cole a <strong>etiqueta</strong> bem esticada na maior face do pacote, sem fita por cima do código de barras. Assine a <strong>declaração</strong> e cole junto, num saquinho plástico ou por fora.
          </p>
          <p className="mt-1 text-navy-500">Sem impressora? Salve o PDF no celular e imprima numa gráfica ou papelaria.</p>
        </>
      ),
    },
    {
      id: 'postar',
      titulo: 'Leve o pacote à agência dos Correios',
      corpo: (
        <>
          <p>
            Entregue o pacote no balcão da agência dos Correios de Breves e diga que a etiqueta <strong>já está paga</strong>. Você <strong>não paga nada</strong> lá. Guarde o comprovante de postagem.
          </p>
          <p className="mt-1">O <strong>código de rastreio</strong> aparece na etiqueta (começa com duas letras e termina com “BR”, ex.: AB123456789BR) e também no painel do Melhor Envio.</p>
        </>
      ),
    },
  ]
  const total = passos.length
  const prontos = passos.filter((p) => feitos.includes(p.id)).length

  return (
    <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/60">
      <button type="button" onClick={() => setAberto((a) => !a)} className="flex w-full items-center gap-3 p-4 text-left">
        <Package className="h-5 w-5 shrink-0 text-cyan-700" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-navy-900">Como enviar este pedido pelos Correios</p>
          <p className="text-xs text-navy-600">
            {o.rastreio ? `Enviado · rastreio ${o.rastreio}` : `${prontos} de ${total} passos feitos · passo a passo com o Melhor Envio`}
          </p>
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
              Primeira vez usando o Melhor Envio? Leia antes (só uma vez)
              <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${primeiraVez ? 'rotate-180' : ''}`} />
            </button>
            {primeiraVez && (
              <div className="space-y-2 border-t border-navy-100 px-3 py-3 text-sm">
                <p>1. Entre no painel com o e-mail e a senha da conta da APHAM.</p>
                <p>
                  2. Em <strong>Configurações → Endereços</strong> (ou <strong>Remetente</strong>), cadastre o endereço de onde os pacotes saem. Fica salvo para os próximos envios:
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Copiar rotulo="Remetente" valor={doacao.titular} />
                  <Copiar rotulo="CNPJ" valor={doacao.cnpj} />
                  <Copiar rotulo="CEP" valor={cepOrigem} />
                  <Copiar rotulo="Endereço" valor={settings.endereco || site.endereco} />
                </div>
                <p>3. Os nomes dos botões no painel podem mudar um pouco com o tempo. Se não achar algum, procure pelo nome parecido no menu da esquerda.</p>
                <Painel />
              </div>
            )}
          </div>

          <ol className="space-y-3">
            {passos.map((p, k) => {
              const ok = feitos.includes(p.id)
              return (
                <li key={p.id} className={`rounded-xl border p-3 ${ok ? 'border-emerald-200 bg-emerald-50/60' : 'border-navy-100 bg-white'}`}>
                  <button type="button" onClick={() => marcar(p.id)} className="flex w-full items-start gap-2 text-left">
                    {ok ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-navy-300" />}
                    <span className={`font-semibold ${ok ? 'text-emerald-800' : 'text-navy-900'}`}>
                      Passo {k + 1}. {p.titulo}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-navy-400">{ok ? 'feito ✓' : 'marcar como feito'}</span>
                  </button>
                  <div className={`mt-2 pl-7 ${ok ? 'opacity-70' : ''}`}>{p.corpo}</div>
                </li>
              )
            })}

            <li className={`rounded-xl border p-3 ${o.rastreio ? 'border-emerald-200 bg-emerald-50/60' : 'border-navy-100 bg-white'}`}>
              <p className={`flex items-start gap-2 font-semibold ${o.rastreio ? 'text-emerald-800' : 'text-navy-900'}`}>
                {o.rastreio ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-navy-300" />}
                Passo {total + 1}. Salve o código de rastreio e avise o cliente
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
                <p className="mt-1 text-xs text-navy-500">Ao salvar, o pedido passa para “Em rota de entrega” e o código aparece para o cliente em “Acompanhar pedido”.</p>
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
        </div>
      )}
    </div>
  )
}
