import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { privacidade, site } from '../data/content'
import Logo from '../components/Logo'

export default function Privacidade() {
  useEffect(() => {
    document.title = `Privacidade e Termos · ${site.nome}`
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      {/* Topo simples */}
      <header className="border-b border-navy-100 bg-white">
        <div className="container-x section-pad flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-10" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-navy-800/80 transition-colors hover:bg-navy-100 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="section-pad container-x py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Privacidade e Termos
          </h1>
          <p className="mt-2 text-sm text-ink/50">
            Última atualização: {privacidade.atualizadoEm}
          </p>
          <p className="mt-6 text-base leading-relaxed text-ink/75">{privacidade.intro}</p>

          <div className="mt-10 space-y-9">
            {privacidade.secoes.map((s) => (
              <section key={s.titulo}>
                <h2 className="font-display text-lg font-bold text-navy-900">{s.titulo}</h2>
                <ul className="mt-3 space-y-2.5">
                  {s.itens.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-navy-50 p-6">
            <p className="text-sm text-ink/75">
              Dúvidas sobre seus dados? Fale com a APHAM pelo e-mail{' '}
              <a href={`mailto:${site.email}`} className="font-semibold text-cyan-700 hover:text-cyan-800">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-navy-100 py-8">
        <div className="container-x section-pad text-center text-xs text-ink/50">
          © {new Date().getFullYear()} {site.nome} — {site.nomeCompleto}.
        </div>
      </footer>
    </div>
  )
}
