import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE = 'APHAM · Associação de Praticantes de Handebol do Marajó'

function tituloPara(pathname) {
  if (pathname === '/') return BASE
  if (pathname.startsWith('/loja/produto')) return 'Produto · Loja APHAM'
  if (pathname.startsWith('/loja')) return 'Loja APHAM · Produtos oficiais do handebol'
  if (pathname.startsWith('/carrinho')) return 'Carrinho · Loja APHAM'
  if (pathname.startsWith('/checkout')) return 'Finalizar pedido · Loja APHAM'
  if (pathname.startsWith('/pedido')) return 'Acompanhar pedido · APHAM'
  if (pathname.startsWith('/admin')) return 'Painel · APHAM'
  if (pathname.startsWith('/projetos')) return 'Projetos · APHAM'
  if (pathname.startsWith('/participar')) return 'Participar · APHAM'
  if (pathname.startsWith('/equipes')) return 'Equipes · APHAM'
  if (pathname.startsWith('/galeria')) return 'Galeria · APHAM'
  if (pathname.startsWith('/contato')) return 'Fale Conosco · APHAM'
  if (pathname.startsWith('/privacidade')) return 'Privacidade e Termos · APHAM'
  return BASE
}

// Rola para o topo e ajusta o título ao trocar de rota.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = tituloPara(pathname)
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])
  return null
}
