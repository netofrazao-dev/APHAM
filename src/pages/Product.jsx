import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Minus, Plus, ShoppingCart, Check, Heart } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../components/Toast'
import { formatBRL, precoFinal } from '../store/format'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'
import ProductImage from '../components/store/ProductImage'
import ProductCard from '../components/store/ProductCard'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { produtos, addToCart, addRecente, toggleFavorito, isFavorito } = useStore()
  const toast = useToast()
  const produto = produtos.find((p) => p.id === id)

  const [imgIdx, setImgIdx] = useState(0)
  const [tamanho, setTamanho] = useState('')
  const [cor, setCor] = useState('')
  const [qtd, setQtd] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (produto) addRecente(produto.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto?.id])

  const relacionados = useMemo(
    () =>
      produto
        ? produtos.filter((p) => p.categoria === produto.categoria && p.id !== produto.id && p.ativo !== false).slice(0, 4)
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
  const semEstoque = Number(produto.estoque) <= 0
  const faltaEscolher = (temTam && !tamanho) || (temCor && !cor)
  const favorito = isFavorito(produto.id)

  const montarItem = () => ({
    id: produto.id,
    nome: produto.nome,
    preco: precoFinal(produto),
    tamanho,
    cor,
    qtd,
    imagem: produto.imagens?.[0] || '',
  })

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
            <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
              {produto.imagens?.length ? (
                <img src={produto.imagens[imgIdx]} alt={produto.nome} className="aspect-square w-full object-cover" />
              ) : (
                <ProductImage produto={produto} className="aspect-square w-full" />
              )}
            </div>
            {produto.imagens?.length > 1 && (
              <div className="mt-3 flex gap-3">
                {produto.imagens.map((im, i) => (
                  <button key={i} type="button" onClick={() => setImgIdx(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === imgIdx ? 'border-cyan-500' : 'border-navy-100'}`}>
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
                <span className="text-lg text-navy-400 line-through">{formatBRL(produto.preco)}</span>
              )}
              <span className="font-display text-3xl font-extrabold text-navy-900">{formatBRL(precoFinal(produto))}</span>
            </div>

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

            {temCor && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-navy-800">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {produto.cores.map((c) => (
                    <button key={c} type="button" onClick={() => setCor(c)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${cor === c ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-navy-200 text-navy-700 hover:border-navy-300'}`}>
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
            {!semEstoque && faltaEscolher && (
              <p className="mt-3 text-sm text-navy-500">Selecione {temTam && !tamanho ? 'o tamanho' : ''}{temTam && !tamanho && temCor && !cor ? ' e ' : ''}{temCor && !cor ? 'a cor' : ''}.</p>
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
