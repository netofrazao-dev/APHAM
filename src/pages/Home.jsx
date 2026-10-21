import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Handebol from '../components/Handebol'
import HandebolMundo from '../components/HandebolMundo'
import News from '../components/News'
import AoVivo from '../components/AoVivo'
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
        <Handebol />
        <News />
        <HandebolMundo />
        <StoreTeaser />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
