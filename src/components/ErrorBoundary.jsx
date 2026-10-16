import { Component } from 'react'

// Captura qualquer erro de renderização e mostra uma tela amigável, em vez de
// deixar o site "em branco". Protege contra erros inesperados em produção.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Log local (e, no futuro, pode enviar para um serviço de monitoramento).
    console.error('Erro capturado pelo ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 p-6 text-center">
          <img src="/midia/logo-apham.png" alt="APHAM" className="h-14 w-auto" />
          <h1 className="mt-8 font-display text-2xl font-extrabold text-white">Algo deu errado</h1>
          <p className="mt-2 max-w-sm text-white/70">
            Tivemos um probleminha ao carregar esta página. Tente recarregar.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-600"
            >
              Recarregar
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ir para o início
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
