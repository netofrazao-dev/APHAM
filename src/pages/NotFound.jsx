import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 p-6 text-center">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="relative">
        <img src="/midia/logo-apham.png" alt="APHAM" className="mx-auto h-14 w-auto" />
        <p className="mt-8 font-display text-6xl font-extrabold text-cyan-400">404</p>
        <h1 className="mt-2 font-display text-xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-2 text-white/70">A página que você procura não existe ou foi movida.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-accent">Ir para o site</Link>
          <Link to="/loja" className="btn border border-white/30 bg-white/5 text-white hover:bg-white/10">Ir para a loja</Link>
        </div>
      </div>
    </div>
  )
}
