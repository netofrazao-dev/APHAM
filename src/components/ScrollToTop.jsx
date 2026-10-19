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
  if (pathname.startsWith('/competicoes')) return 'Competições · APHAM'
  if (pathname.startsWith('/galeria')) return 'Galeria · APHAM'
  if (pathname.startsWith('/contato')) return 'Fale Conosco · APHAM'
  if (pathname.startsWith('/reconhecimentos')) return 'Prêmios e Certificações · APHAM'
  if (pathname.startsWith('/incentivo')) return 'Lei de Incentivo ao Esporte · APHAM'
  if (pathname.startsWith('/cooperativa')) return 'Cooperativa Social · APHAM'
  if (pathname.startsWith('/documentario')) return 'Documentário · APHAM'
  if (pathname.startsWith('/privacidade')) return 'Privacidade e Termos · APHAM'
  return BASE
}

// Rola para o topo (ou até a âncora, quando há #) e ajusta o título ao trocar de rota.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = tituloPara(pathname)

    if (hash) {
      // Rola até a seção da âncora. Como algumas páginas carregam sob demanda,
      // tenta algumas vezes até o elemento existir na tela.
      const id = decodeURIComponent(hash.slice(1))
      let tentativas = 0
      const rolar = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (tentativas++ < 25) {
          setTimeout(rolar, 100)
        }
      }
      rolar()
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])
  return null
}
