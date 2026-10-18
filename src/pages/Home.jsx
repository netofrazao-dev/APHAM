import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import News from '../components/News'
import Events from '../components/Events'
import AoVivo from '../components/AoVivo'
import Support from '../components/Support'
import StoreTeaser from '../components/StoreTeaser'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

// A home é a parte que "rola" — conteúdo atualizado com frequência (novidades,
// eventos, transmissão ao vivo). As seções mais fixas viraram subpáginas,
// acessadas pelo sumário (menu): /projetos, /participar, /equipes, /galeria,
// /contato.
export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <AoVivo />
        <News />
        <Events />
        <Support />
        <StoreTeaser />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
