import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { inputCls, btnPrimary } from './ui'

export default function AdminLogin() {
  const { login } = useStore()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!login(senha)) {
      setErro(true)
      setSenha('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <form onSubmit={onSubmit} className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-lift">
        <div className="flex flex-col items-center text-center">
          <img src="/midia/logo-apham.png" alt="APHAM" className="h-14 w-auto" />
          <span className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-100 text-navy-700">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy-900">Painel da APHAM</h1>
          <p className="mt-1 text-sm text-navy-500">Entre para gerenciar o site e a loja.</p>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800">Senha</label>
          <input
            type="password"
            autoFocus
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro(false)
            }}
            className={inputCls}
            placeholder="••••••••"
          />
          {erro && <p className="mt-2 text-sm font-medium text-red-600">Senha incorreta.</p>}
        </div>

        <button type="submit" className={`${btnPrimary} mt-5 w-full`}>Entrar</button>

        <Link to="/" className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-navy-500 hover:text-cyan-700">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>
      </form>
    </div>
  )
}
