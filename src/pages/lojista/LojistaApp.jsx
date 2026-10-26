import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ClipboardList, Clock, ExternalLink, LayoutDashboard, LogOut, Package, PauseCircle, Store, Upload, Wallet, X, XCircle } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { fileToOptimizedDataURL } from '../../store/images'
import { STATUS_LOJA, saldoDaLoja, urlLoja } from '../../store/lojas'
import { statusInfo, statusCor } from '../../store/constants'
import ProductsAdmin from '../admin/ProductsAdmin'
import { Card, Field, inputCls, btnPrimary, btnGhost, PageTitle } from '../admin/ui'

// Área do lojista parceiro (/lojista): login, situação do cadastro e, com a loja
// aprovada, resumo financeiro, dados da loja, produtos e pedidos.

function Login() {
  const { entrarLojista } = useStore()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const enviar = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro(false)
    const ok = await entrarLojista(email.trim(), senha)
    setCarregando(false)
    if (!ok) setErro(true)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <form onSubmit={enviar} className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-lift">
        <div className="text-center">
          <img src="/midia/logo-apham.png" alt="APHAM" className="mx-auto h-14 w-auto" />
          <span className="mx-auto mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
            <Store className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy-900">Área do lojista</h1>
          <p className="mt-1 text-sm text-navy-500">Entre para cuidar da sua loja na loja da APHAM.</p>
        </div>
        <div className="mt-6 space-y-4">
          <Field label="E-mail">
            <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Senha">
            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className={inputCls} />
          </Field>
          {erro && <p className="text-sm font-medium text-red-600">E-mail ou senha incorretos.</p>}
        </div>
        <button type="submit" disabled={carregando} className={`${btnPrimary} mt-5 w-full`}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="mt-5 text-center text-sm text-navy-500">
          Ainda não vende com a gente?{' '}
          <Link to="/vender" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Cadastre sua loja
          </Link>
        </p>
      </form>
    </div>
  )
}

function UploadImagem({ label, valor, onChange, largo }) {
  const [carregando, setCarregando] = useState(false)
  const handle = async (file) => {
    if (!file) return
    setCarregando(true)
    try {
      onChange(await fileToOptimizedDataURL(file, largo ? 1400 : 600, 0.82))
    } catch {
      alert('Não consegui processar a imagem.')
    } finally {
      setCarregando(false)
    }
  }
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {valor ? (
          <div className={`relative overflow-hidden rounded-xl border border-navy-200 ${largo ? 'h-20 w-40' : 'h-20 w-20'}`}>
            <img src={valor} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange('')} className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-950/70 text-white" aria-label="Remover">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-navy-200 text-navy-400 hover:border-cyan-400 hover:text-cyan-600 ${largo ? 'h-20 w-40' : 'h-20 w-20'}`}>
            <Upload className="h-5 w-5" />
            <span className="text-[10px] font-medium">{carregando ? '...' : 'Enviar'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
          </label>
        )}
      </div>
    </Field>
  )
}

function MinhaLoja() {
  const { minhaLoja, salvarMinhaLoja } = useStore()
  const [f, setF] = useState(() => ({ ...minhaLoja }))
  const [estado, setEstado] = useState('') // '', 'salvando', 'ok', 'erro'
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))
  const salvar = async (e) => {
    e.preventDefault()
    setEstado('salvando')
    const { id, dono, status, criadaEm, slug, ...dados } = f
    const ok = await salvarMinhaLoja(dados)
    setEstado(ok ? 'ok' : 'erro')
    if (ok) setTimeout(() => setEstado(''), 2000)
  }
  return (
    <form onSubmit={salvar}>
      <PageTitle title="Minha loja" subtitle="Como a sua loja aparece para os clientes" />
      <Card className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome da loja *">
          <input required value={f.nome || ''} onChange={set('nome')} className={inputCls} />
        </Field>
        <Field label="Responsável">
          <input value={f.responsavel || ''} onChange={set('responsavel')} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Sobre a loja">
            <textarea rows={3} value={f.descricao || ''} onChange={set('descricao')} className={`${inputCls} resize-y`} />
          </Field>
        </div>
        <UploadImagem label="Logo" valor={f.logo} onChange={(v) => setF((p) => ({ ...p, logo: v }))} />
        <UploadImagem label="Capa (imagem larga)" valor={f.capa} onChange={(v) => setF((p) => ({ ...p, capa: v }))} largo />
        <Field label="WhatsApp">
          <input value={f.whatsapp || ''} onChange={set('whatsapp')} className={inputCls} />
        </Field>
        <Field label="Cidade">
          <input value={f.cidade || ''} onChange={set('cidade')} className={inputCls} />
        </Field>
        <Field label="Instagram">
          <input value={f.instagram || ''} onChange={set('instagram')} className={inputCls} placeholder="@sualoja" />
        </Field>
        <div />
        <Field label="Chave PIX para os repasses">
          <input value={f.pixChave || ''} onChange={set('pixChave')} className={inputCls} />
        </Field>
        <Field label="Titular do PIX">
          <input value={f.pixTitular || ''} onChange={set('pixTitular')} className={inputCls} />
        </Field>
      </Card>
      <div className="mt-5 flex items-center justify-end gap-3">
        {estado === 'ok' && <span className="text-sm font-semibold text-emerald-600">Salvo!</span>}
        {estado === 'erro' && <span className="text-sm font-semibold text-red-600">Não foi possível salvar.</span>}
        <button type="submit" disabled={estado === 'salvando'} className={btnPrimary}>
          {estado === 'salvando' ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

function Resumo({ irPara }) {
  const { minhaLoja, pedidosDaMinhaLoja, repasses, comissao } = useStore()
  const s = useMemo(() => saldoDaLoja(pedidosDaMinhaLoja, repasses, minhaLoja.id), [pedidosDaMinhaLoja, repasses, minhaLoja.id])
  const meus = repasses.filter((r) => r.lojaId === minhaLoja.id)
  return (
    <div>
      <PageTitle title={`Olá, ${minhaLoja.responsavel || minhaLoja.nome}!`} subtitle="O resumo da sua loja na loja da APHAM">
        <Link to={urlLoja(minhaLoja)} target="_blank" className={btnGhost}>
          <ExternalLink className="h-4 w-4" />
          Ver minha loja
        </Link>
      </PageTitle>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['A receber', formatBRL(s.aReceber), true],
          ['Vendas pagas', s.qtdPagos],
          ['Seu total vendido', formatBRL(s.lojista)],
          ['Já recebido', formatBRL(s.repassado)],
        ].map(([r, v, destaque]) => (
          <Card key={r} className={destaque ? 'border-cyan-200 bg-cyan-50' : ''}>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{r}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-navy-900">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5 text-sm leading-relaxed text-navy-700">
        <p>
          Os clientes pagam a APHAM. Quando o pagamento de um pedido é confirmado, o seu valor entra em <strong>A receber</strong>, e a APHAM faz o
          repasse pela sua chave PIX. Seus produtos aparecem na loja com o seu preço + {comissao}% da APHAM.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => irPara('produtos')} className={btnPrimary}>
            <Package className="h-4 w-4" />
            Cadastrar produtos
          </button>
          <button type="button" onClick={() => irPara('pedidos')} className={btnGhost}>
            <ClipboardList className="h-4 w-4" />
            Ver pedidos
          </button>
        </div>
      </Card>
      <h2 className="mt-8 font-display text-lg font-bold text-navy-900">Repasses recebidos</h2>
      <div className="mt-3 space-y-2">
        {meus.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span className="inline-flex items-center gap-2 text-navy-700">
              <Wallet className="h-4 w-4 text-cyan-600" />
              {r.dataPagamento ? r.dataPagamento.split('-').reverse().join('/') : new Date(r.criadoEm).toLocaleDateString('pt-BR')}
              {r.obs && <span className="text-navy-400">· {r.obs}</span>}
            </span>
            <strong className="text-navy-900">{formatBRL(r.valor)}</strong>
          </Card>
        ))}
        {meus.length === 0 && <Card className="text-sm text-navy-500">Nenhum repasse ainda.</Card>}
      </div>
    </div>
  )
}

function Pedidos() {
  const { minhaLoja, pedidosDaMinhaLoja } = useStore()
  const { pedidos } = saldoDaLoja(pedidosDaMinhaLoja, [], minhaLoja.id)
  return (
    <div>
      <PageTitle title="Pedidos" subtitle="Pedidos com produtos da sua loja" />
      <div className="space-y-3">
        {pedidos.map(({ pedido: o, itens, lojista, pago }) => (
          <Card key={o.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-base font-bold text-navy-900">Pedido {o.numero}</p>
                <p className="text-xs text-navy-500">{o.data ? new Date(o.data).toLocaleString('pt-BR') : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusCor[o.status] || statusCor.recebido}`}>{statusInfo(o.status).label}</span>
                <span className="text-sm font-bold text-navy-900">{formatBRL(lojista)}</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-navy-700">
              {itens.map((i, k) => (
                <li key={k}>
                  {i.qtd}x {i.nome}
                  {(i.tamanho || i.cor) && <span className="text-navy-400"> ({[i.tamanho, i.cor].filter(Boolean).join(', ')})</span>} —{' '}
                  {formatBRL((i.precoLojista ?? i.preco) * i.qtd)}
                </li>
              ))}
            </ul>
            {o.cliente && (
              <p className="mt-3 rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-600">
                Cliente: {o.cliente.nome}
                {o.cliente.telefone && ` · ${o.cliente.telefone}`}
                {o.entrega && ` · ${o.entrega === 'entrega' ? `Entrega: ${o.endereco || ''}` : 'Retirada'}`}
              </p>
            )}
            {!pago && o.status !== 'cancelado' && <p className="mt-2 text-xs text-amber-700">Aguardando a APHAM confirmar o pagamento.</p>}
          </Card>
        ))}
        {pedidos.length === 0 && <Card className="text-sm text-navy-500">Nenhum pedido com produtos da sua loja ainda.</Card>}
      </div>
    </div>
  )
}

function Situacao({ loja, sair }) {
  const info = {
    pendente: { Icone: Clock, titulo: 'Cadastro em análise', texto: 'A APHAM está analisando o pedido da sua loja. Assim que for aprovado, você poderá cadastrar seus produtos aqui.' },
    recusada: { Icone: XCircle, titulo: 'Cadastro não aprovado', texto: 'O pedido da sua loja não foi aprovado. Fale com a APHAM para saber mais.' },
    suspensa: { Icone: PauseCircle, titulo: 'Loja suspensa', texto: 'Sua loja está temporariamente fora da vitrine. Fale com a APHAM para reativar.' },
  }[loja.status]
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <Card className="w-full max-w-lg p-8 text-center">
        <info.Icone className="mx-auto h-10 w-10 text-cyan-600" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-navy-900">{info.titulo}</h1>
        <p className="mt-3 text-ink/75">{info.texto}</p>
        <p className="mt-4 text-sm text-navy-500">Loja: <strong>{loja.nome}</strong></p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className={btnGhost}>
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <button type="button" onClick={sair} className={btnGhost}>
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </Card>
    </div>
  )
}

const ABAS = [
  { id: 'resumo', label: 'Resumo', Icone: LayoutDashboard },
  { id: 'loja', label: 'Minha loja', Icone: Store },
  { id: 'produtos', label: 'Produtos', Icone: Package },
  { id: 'pedidos', label: 'Pedidos', Icone: ClipboardList },
]

export default function LojistaApp() {
  const { minhaLoja, usuario, supabaseAtivo, sairLojista } = useStore()
  const [aba, setAba] = useState('resumo')

  if (!minhaLoja) {
    if (supabaseAtivo && usuario) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-4">
          <Card className="w-full max-w-md p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-cyan-600" />
            <h1 className="mt-4 font-display text-xl font-extrabold text-navy-900">Esta conta não tem loja</h1>
            <p className="mt-2 text-sm text-navy-600">Se você acabou de confirmar o e-mail, aguarde um instante e atualize a página.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/vender" className={btnPrimary}>Cadastrar loja</Link>
              <button type="button" onClick={sairLojista} className={btnGhost}>Sair</button>
            </div>
          </Card>
        </div>
      )
    }
    return <Login />
  }
  if (minhaLoja.status !== 'aprovada') return <Situacao loja={minhaLoja} sair={sairLojista} />

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-navy-950 text-white">
        <div className="section-pad container-x flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white/10 font-display font-extrabold">
              {minhaLoja.logo ? <img src={minhaLoja.logo} alt="" className="h-full w-full object-cover" /> : minhaLoja.nome.slice(0, 1)}
            </div>
            <div>
              <p className="font-display text-base font-extrabold">{minhaLoja.nome}</p>
              <p className="text-xs text-white/60">
                Loja parceira APHAM · <span className={`rounded-full px-1.5 py-px text-[10px] font-bold ${STATUS_LOJA.aprovada.cor}`}>{STATUS_LOJA.aprovada.label}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={urlLoja(minhaLoja)} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
              <ArrowUpRight className="h-4 w-4" />
              Minha vitrine
            </Link>
            <button type="button" onClick={sairLojista} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
        <nav className="section-pad container-x flex gap-1 overflow-x-auto pb-3">
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${aba === a.id ? 'bg-cyan-500 text-white' : 'text-white/75 hover:bg-white/10'}`}
            >
              <a.Icone className="h-4 w-4" />
              {a.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="section-pad container-x py-8">
        {aba === 'resumo' && <Resumo irPara={setAba} />}
        {aba === 'loja' && <MinhaLoja />}
        {aba === 'produtos' && <ProductsAdmin loja={minhaLoja} />}
        {aba === 'pedidos' && <Pedidos />}
      </main>
    </div>
  )
}
