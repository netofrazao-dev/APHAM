import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'

// Carregadas sob demanda (reduz o tamanho inicial do site).
const Store = lazy(() => import('./pages/Store'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Privacidade = lazy(() => import('./pages/Privacidade'))
const Projetos = lazy(() => import('./pages/Projetos'))
const ParticiparPage = lazy(() => import('./pages/ParticiparPage'))
const EquipesPage = lazy(() => import('./pages/EquipesPage'))
const CompeticoesPage = lazy(() => import('./pages/CompeticoesPage'))
const GaleriaPage = lazy(() => import('./pages/GaleriaPage'))
const ContatoPage = lazy(() => import('./pages/ContatoPage'))
const ReconhecimentosPage = lazy(() => import('./pages/ReconhecimentosPage'))
const IncentivoPage = lazy(() => import('./pages/IncentivoPage'))
const CooperativaPage = lazy(() => import('./pages/CooperativaPage'))
const DocumentarioPage = lazy(() => import('./pages/DocumentarioPage'))
const LivesPage = lazy(() => import('./pages/LivesPage'))
const ApoiePage = lazy(() => import('./pages/ApoiePage'))
const QuemSomosPage = lazy(() => import('./pages/QuemSomosPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-200 border-t-cyan-500" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/participar" element={<ParticiparPage />} />
          <Route path="/equipes" element={<EquipesPage />} />
          <Route path="/competicoes" element={<CompeticoesPage />} />
          <Route path="/galeria" element={<GaleriaPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/reconhecimentos" element={<ReconhecimentosPage />} />
          <Route path="/incentivo" element={<IncentivoPage />} />
          <Route path="/cooperativa" element={<CooperativaPage />} />
          <Route path="/documentario" element={<DocumentarioPage />} />
          <Route path="/lives" element={<LivesPage />} />
          <Route path="/apoie" element={<ApoiePage />} />
          <Route path="/quem-somos" element={<QuemSomosPage />} />
          <Route path="/loja" element={<Store />} />
          <Route path="/loja/produto/:id" element={<Product />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido" element={<OrderTracking />} />
          <Route path="/pedido/:numero" element={<OrderTracking />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
