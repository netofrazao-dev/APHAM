import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Check, Heart, Store as StoreIcon, BadgeCheck, Truck, RotateCcw } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../components/Toast'
import { formatBRL } from '../store/format'
import { precoVitrine, precoCheioVitrine, itemCarrinho, urlLoja, chaveVariacao } from '../store/lojas'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductImage from '../components/store/ProductImage'
import ProductCard from '../components/store/ProductCard'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { produtosVitrine: produtos, addToCart, addRecente, toggleFavorito, isFavorito, comissao, lojasPorId } = useStore()
  const toast = useToast()
  const produto = produtos.find((p) => p.id === id)

  const [imgIdx, setImgIdx] = useState(0)
  const [tamanho, setTamanho] = useState('')
  const [cor, setCor] = useState('')
  const [modelo, setModelo] = useState('')
  const toque = useRef(null)
  const [qtd, setQtd] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (produto) addRecente(produto.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto?.id])

  const relacionados = useMemo(
    () =>
      produto
        ? produtos.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, 4)
        : [],
    [produtos, produto]
  )

  if (!produto) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <StoreHeader />
        <div className="container-x section-pad flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-navy-600">Produto não encontrado.</p>
          <Link to="/loja" className="btn-accent">Voltar à loja</Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  const temTam = (produto.tamanhos?.length || 0) > 0
  const temCor = (produto.cores?.length || 0) > 0
  const temModelo = (produto.modelos?.length || 0) > 0
  const fotos = produto.imagens || []
  const irFoto = (i) => fotos.length && setImgIdx((i + fotos.length) % fotos.length)
  // Escolher uma cor/modelo mostra a foto ligada a ela no painel (se houver).
  const escolher = (tipo, valor) => {
    if (tipo === 'cor') setCor(valor)
    else setModelo(valor)
    const i = produto.fotoDe?.[chaveVariacao(tipo, valor)]
    if (Number.isInteger(i) && i < fotos.length) setImgIdx(i)
  }
  const fimToque = (e) => {
    const dx = e.changedTouches[0].clientX - (toque.current ?? 0)
    if (Math.abs(dx) > 40) irFoto(dx < 0 ? imgIdx + 1 : imgIdx - 1)
  }
  const semEstoque = Number(produto.estoque) <= 0
  const faltaEscolher = (temTam && !tamanho) || (temCor && !cor) || (temModelo && !modelo)
  const favorito = isFavorito(produto.id)

  const montarItem = () => itemCarrinho(produto, comissao, { tamanho, cor, modelo, qtd })
  const loja = produto.lojaId ? lojasPorId[produto.lojaId] : null

  const handleAdd = () => {
    if (faltaEscolher || semEstoque) return
    addToCart(montarItem())
    setAdded(true)
    toast('Adicionado ao carrinho')
    setTimeout(() => setAdded(false), 1800)
  }
  const handleBuy = () => {
    if (faltaEscolher || semEstoque) return
    addToCart(montarItem())
    navigate('/carrinho')
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />

      <div className="container-x section-pad flex-1 py-8 lg:py-12">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-navy-500">
          <Link to="/loja" className="hover:text-cyan-700">Loja</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-navy-700">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Galeria */}
          <div>
            {/* Foto principal: deslize para os lados (celular) ou use as setas */}
            <div
              className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white"
              onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
              onTouchEnd={fimToque}
            >
              {fotos.length ? (
                <img src={fotos[imgIdx] || fotos[0]} alt={produto.nome} className="aspect-square w-full select-none object-cover" draggable={false} />
              ) : (
                <ProductImage produto={produto} className="aspect-square w-full" />
              )}
              {fotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => irFoto(imgIdx - 1)}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-900 shadow-soft transition hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => irFoto(imgIdx + 1)}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-900 shadow-soft transition hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                    {fotos.map((_, i) => (
                      <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-5 bg-cyan-500' : 'w-1.5 bg-white/80'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {fotos.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {fotos.map((im, i) => (
                  <button key={i} type="button" onClick={() => setImgIdx(i)} aria-label={`Ver foto ${i + 1}`} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === imgIdx ? 'border-cyan-500' : 'border-navy-100'}`}>
                    <img src={im} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{produto.nome}</h1>
              <button
                type="button"
                onClick={() => {
                  toggleFavorito(produto.id)
                  toast(favorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 'info')
                }}
                aria-label={favorito ? 'Remover dos favoritos' : 'Favoritar'}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy-200 text-navy-500 transition-colors hover:text-cyan-600"
              >
                <Heart className={`h-5 w-5 ${favorito ? 'fill-cyan-500 text-cyan-500' : ''}`} />
              </button>
            </div>
            <div className="mt-4 flex items-end gap-3">
              {produto.precoPromo != null && produto.precoPromo !== '' && (
                <span className="text-lg text-navy-400 line-through">{formatBRL(precoCheioVitrine(produto, comissao))}</span>
              )}
              <span className="font-display text-3xl font-extrabold text-navy-900">{formatBRL(precoVitrine(produto, comissao))}</span>
            </div>

            {loja && (
              <Link to={urlLoja(loja)} className="mt-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-3 transition-colors hover:bg-violet-100">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white font-display font-extrabold text-violet-700">
                  {loja.logo ? <img src={loja.logo} alt="" className="h-full w-full object-cover" /> : <StoreIcon className="h-5 w-5" />}
                </span>
                <span className="text-sm text-navy-700">
                  Vendido por <strong className="text-violet-800">{loja.nome}</strong>, loja parceira da APHAM
                  <span className="block text-xs text-navy-500">Pagamento e atendimento pela APHAM · ver a loja</span>
                </span>
              </Link>
            )}

            {!loja && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-800">
                <BadgeCheck className="h-4 w-4" />
                Produto oficial · vendido e entregue pela APHAM
              </p>
            )}

            {produto.descricao && <p className="mt-5 leading-relaxed text-ink/75">{produto.descricao}</p>}

            {temTam && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-navy-800">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {produto.tamanhos.map((t) => (
                    <button key={t} type="button" onClick={() => setTamanho(t)} className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${tamanho === t ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700 hover:border-navy-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {temModelo && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-navy-800">Modelo</p>
                <div className="flex flex-wrap gap-2">
                  {produto.modelos.map((m) => (
                    <button key={m} type="button" onClick={() => escolher('modelo', m)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${modelo === m ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700 hover:border-navy-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {temCor && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-navy-800">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {produto.cores.map((c) => (
                    <button key={c} type="button" onClick={() => escolher('cor', c)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${cor === c ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700 hover:border-navy-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-navy-800">Quantidade</p>
              <div className="inline-flex items-center rounded-xl border border-navy-200">
                <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-navy-700 hover:bg-navy-100" aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
                <span className="w-12 text-center font-semibold text-navy-900">{qtd}</span>
                <button type="button" onClick={() => setQtd((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-navy-700 hover:bg-navy-100" aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
              </div>
              {produto.estoque > 0 && produto.estoque <= 5 && (
                <span className="ml-3 text-sm font-medium text-amber-600">Últimas {produto.estoque} unidades!</span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleAdd} disabled={semEstoque || faltaEscolher} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50">
                {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </button>
              <button type="button" onClick={handleBuy} disabled={semEstoque || faltaEscolher} className="btn-accent flex-1 disabled:cursor-not-allowed disabled:opacity-50">
                Comprar agora
              </button>
            </div>
            {semEstoque && <p className="mt-3 text-sm font-medium text-cyan-700">Produto esgotado no momento.</p>}

            <ul className="mt-6 space-y-2 rounded-2xl border border-navy-100 bg-white p-4 text-sm text-navy-700">
              <li className="flex items-start gap-2.5">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                Pronta entrega: retirada ou entrega em Breves (PA), ou envio para todo o Brasil.
              </li>
              <li className="flex items-start gap-2.5">
                <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                <span>
                  Troca ou desistência em até 7 dias após receber.{' '}
                  <Link to="/loja/trocas" className="font-semibold text-cyan-700 hover:underline">
                    Ver as regras
                  </Link>
                </span>
              </li>
            </ul>
            {!semEstoque && faltaEscolher && (
              <p className="mt-3 text-sm text-navy-500">
                Selecione {[temTam && !tamanho && 'o tamanho', temModelo && !modelo && 'o modelo', temCor && !cor && 'a cor'].filter(Boolean).join(' e ')}.
              </p>
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold text-navy-900">Você também pode gostar</h2>
            <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
              {relacionados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  )
}
