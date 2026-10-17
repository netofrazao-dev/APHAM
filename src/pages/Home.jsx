import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import AoVivo from '../components/AoVivo'
import About from '../components/About'
import Values from '../components/Values'
import News from '../components/News'
import Events from '../components/Events'
import Equipes from '../components/Equipes'
import Awards from '../components/Awards'
import Cooperativa from '../components/Cooperativa'
import Videos from '../components/Videos'
import Documentario from '../components/Documentario'
import Gallery from '../components/Gallery'
import Participar from '../components/Participar'
import Support from '../components/Support'
import TaxIncentive from '../components/TaxIncentive'
import StoreTeaser from '../components/StoreTeaser'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <AoVivo />
        <About />
        <Values />
        <News />
        <Events />
        <Equipes />
        <Awards />
        <Cooperativa />
        <Videos />
        <Documentario />
        <Gallery />
        <Participar />
        <Support />
        <TaxIncentive />
        <StoreTeaser />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
