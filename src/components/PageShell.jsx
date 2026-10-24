import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'

// Layout das subpáginas (abertas pelo sumário): navbar sólida + cabeçalho + conteúdo.
export default function PageShell({ eyebrow, titulo, descricao, children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <header className="relative overflow-hidden bg-navy-950 pt-28 pb-14 lg:pt-32 lg:pb-16">
        <img
          src="/midia/marca/marajoara-dark.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/50" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="section-pad container-x relative text-center">
          {eyebrow && (
            <span className="eyebrow flex justify-center text-cyan-300">
              <span className="h-px w-6 bg-cyan-400" />
              {eyebrow}
              <span className="h-px w-6 bg-cyan-400" />
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {titulo}
          </h1>
          {descricao && <p className="mx-auto mt-4 max-w-2xl text-white/70">{descricao}</p>}
        </div>
      </header>

      <main>{children}</main>

      <Footer />
      <BackToTop />
    </div>
  )
}
