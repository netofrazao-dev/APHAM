import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { lojaConceito, assinaturaSocialPlay } from '../data/content'
import Reveal from './Reveal'

// Chamada para a loja na home.
export default function StoreTeaser() {
  return (
    <section id="loja" className="section-pad pb-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 to-navy-950 px-8 py-14 text-center shadow-lift sm:px-12">
            <div className="absolute inset-0 dot-grid opacity-20" />
            <img src="/midia/marca/marajoara-dark.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            {/* Assinatura dourada da Social Play, de fundo */}
            <img
              src={assinaturaSocialPlay}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 w-[80%] max-w-xl -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.12]"
            />
            <div className="relative mx-auto max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                <ShoppingBag className="h-3.5 w-3.5" />
                {lojaConceito.marca} · Loja oficial
              </span>
              <h2 className="mt-5 font-akbar text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {lojaConceito.conceito}
              </h2>
              <p className="mt-4 text-white/80">{lojaConceito.descricao}</p>
              <Link to="/loja" className="btn-accent mt-8">
                <ShoppingBag className="h-4 w-4" />
                Visitar a loja
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
