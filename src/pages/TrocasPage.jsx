import { Link } from 'react-router-dom'
import { Truck, RotateCcw, Shirt, ShieldCheck, Store, MessageCircle } from 'lucide-react'
import { politicaLoja, site } from '../data/content'
import StoreHeader from '../components/store/StoreHeader'
import StoreFooter from '../components/store/StoreFooter'

const ICONES = { Truck, RotateCcw, Shirt, ShieldCheck, Store }

// Política de trocas, devoluções e entregas da loja (texto em content.js → politicaLoja).
export default function TrocasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <StoreHeader />
      <div className="container-x section-pad flex-1 py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-navy-500">
            <Link to="/loja" className="hover:text-cyan-700">Loja</Link>
            <span>/</span>
            <span className="text-navy-800">{politicaLoja.titulo}</span>
          </nav>
          <h1 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{politicaLoja.titulo}</h1>
          <p className="mt-3 leading-relaxed text-ink/75">{politicaLoja.resumo}</p>

          <div className="mt-8 space-y-4">
            {politicaLoja.secoes.map((s) => {
              const Ic = ICONES[s.icone] || ShieldCheck
              return (
                <section key={s.titulo} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-5 sm:p-6">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Ic className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy-900">{s.titulo}</h2>
                    <ul className="mt-2 space-y-2">
                      {s.itens.map((t) => (
                        <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-navy-950 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-white/80">{politicaLoja.comoPedir}</p>
            <a
              href={`https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent('Olá! Quero falar sobre o meu pedido ')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  )
}
