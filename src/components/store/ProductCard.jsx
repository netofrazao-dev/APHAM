import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Heart } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useToast } from '../Toast'
import { formatBRL, precoFinal } from '../../store/format'
import ProductImage from './ProductImage'

export default function ProductCard({ produto }) {
  const { addToCart, toggleFavorito, isFavorito } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const temPromo = produto.precoPromo != null && produto.precoPromo !== ''
  const precisaEscolher = (produto.tamanhos?.length || 0) > 0 || (produto.cores?.length || 0) > 0
  const semEstoque = Number(produto.estoque) <= 0
  const favorito = isFavorito(produto.id)

  const handleAdd = () => {
    if (precisaEscolher) {
      navigate(`/loja/produto/${produto.id}`)
      return
    }
    addToCart({
      id: produto.id,
      nome: produto.nome,
      preco: precoFinal(produto),
      tamanho: '',
      cor: '',
      qtd: 1,
      imagem: produto.imagens?.[0] || '',
    })
    toast('Adicionado ao carrinho')
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/loja/produto/${produto.id}`} className="relative block">
        <ProductImage produto={produto} className="aspect-square w-full" />
        {temPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white">
            Promoção
          </span>
        )}
        {semEstoque && (
          <span className="absolute right-3 top-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-semibold text-white">
            Esgotado
          </span>
        )}
      </Link>
      {!semEstoque && (
        <button
          type="button"
          onClick={() => {
            toggleFavorito(produto.id)
            toast(favorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 'info')
          }}
          aria-label={favorito ? 'Remover dos favoritos' : 'Favoritar'}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-500 shadow-soft transition-colors hover:text-cyan-600"
        >
          <Heart className={`h-4 w-4 ${favorito ? 'fill-cyan-500 text-cyan-500' : ''}`} />
        </button>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/loja/produto/${produto.id}`} className="flex-1">
          <h3 className="font-display text-sm font-bold leading-snug text-navy-900 hover:text-cyan-700">
            {produto.nome}
          </h3>
        </Link>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {temPromo && (
              <span className="block text-xs text-navy-400 line-through">{formatBRL(produto.preco)}</span>
            )}
            <span className="font-display text-lg font-extrabold text-navy-900">
              {formatBRL(precoFinal(produto))}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={semEstoque}
            aria-label={precisaEscolher ? 'Ver opções' : 'Adicionar ao carrinho'}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-navy-200"
          >
            {precisaEscolher ? <Plus className="h-5 w-5" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  )
}
