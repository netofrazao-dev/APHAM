import { useState } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, ChevronRight, X, Loader2 } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { enderecoVazio, formatarCep, buscarCep, resumoDestino, avisoDestino } from '../../store/entrega'

const campo =
  'w-full rounded-xl border border-navy-200 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100'

// Faixa "Enviar para" logo abaixo do cabeçalho da loja (como Mercado Livre e
// Amazon). O endereço fica salvo só neste aparelho e já vem no checkout.
export default function EnderecoEntrega() {
  const { enderecoEntrega: end, salvarEnderecoEntrega } = useStore()
  const [aberto, setAberto] = useState(false)
  const resumo = resumoDestino(end)

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="flex w-full items-center gap-2 border-t border-navy-100 bg-navy-50/70 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-100/70"
      >
        <span className="container-x section-pad flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-cyan-600" />
          {resumo ? (
            <span className="min-w-0 flex-1 truncate">
              Enviar para <strong className="font-semibold text-navy-900">{resumo}</strong>
              <span className="hidden text-navy-500 sm:inline"> · {avisoDestino(end)}</span>
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate">
              <strong className="font-semibold text-navy-900">Informe seu CEP</strong> para ver como chega até você
            </span>
          )}
          <ChevronRight className="h-4 w-4 shrink-0 text-navy-400" />
        </span>
      </button>
      {/* Portal: o cabeçalho tem desfoque (backdrop-blur), que prenderia o "fixed" dentro dele. */}
      {aberto &&
        createPortal(
          <ModalEndereco
            inicial={end}
            onFechar={() => setAberto(false)}
            onSalvar={(e) => {
              salvarEnderecoEntrega(e)
              setAberto(false)
            }}
          />,
          document.body
        )}
    </>
  )
}

function ModalEndereco({ inicial, onFechar, onSalvar }) {
  const [e, setE] = useState(() => ({ ...enderecoVazio(), ...(inicial || {}) }))
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')
  const set = (k) => (ev) => setE((x) => ({ ...x, [k]: ev.target.value }))

  const mudarCep = async (valor) => {
    const cep = formatarCep(valor)
    setErro('')
    setE((x) => ({ ...x, cep }))
    if (cep.replace(/\D/g, '').length !== 8) return
    setBuscando(true)
    const r = await buscarCep(cep)
    setBuscando(false)
    if (!r) return setErro('CEP não encontrado. Confira os números ou preencha a cidade à mão.')
    // CEP novo: troca rua e bairro pelos do CEP e limpa o número.
    setE((x) => ({ ...x, ...r, numero: x.cep === inicial?.cep ? x.numero : '' }))
  }

  const salvar = (ev) => {
    ev.preventDefault()
    if (e.cep.replace(/\D/g, '').length !== 8) return setErro('Informe um CEP com 8 números.')
    if (!e.cidade || !e.uf) return setErro('Informe a cidade e a UF.')
    onSalvar({ ...e, uf: e.uf.toUpperCase() })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onFechar}>
      <form
        onSubmit={salvar}
        onClick={(ev) => ev.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-3xl"
        aria-label="Endereço de entrega"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-navy-900">Onde você quer receber?</h2>
            <p className="mt-1 text-sm text-navy-500">Fica salvo só neste aparelho e já vem preenchido no checkout.</p>
          </div>
          <button type="button" onClick={onFechar} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-6 gap-3">
          <label className="col-span-6 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">CEP *</span>
            <span className="relative block">
              <input autoFocus inputMode="numeric" autoComplete="postal-code" value={e.cep} onChange={(ev) => mudarCep(ev.target.value)} className={campo} placeholder="00000-000" />
              {buscando && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-navy-400" />}
            </span>
          </label>
          <label className="col-span-4 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">Cidade *</span>
            <input value={e.cidade} onChange={set('cidade')} className={campo} />
          </label>
          <label className="col-span-2 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">UF *</span>
            <input maxLength={2} value={e.uf} onChange={(ev) => setE((x) => ({ ...x, uf: ev.target.value.toUpperCase() }))} className={campo} />
          </label>
          <label className="col-span-4 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">Rua</span>
            <input value={e.rua} onChange={set('rua')} className={campo} />
          </label>
          <label className="col-span-2 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">Número</span>
            <input value={e.numero} onChange={set('numero')} className={campo} />
          </label>
          <label className="col-span-3 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">Bairro</span>
            <input value={e.bairro} onChange={set('bairro')} className={campo} />
          </label>
          <label className="col-span-3 block">
            <span className="mb-1 block text-sm font-semibold text-navy-800">Complemento</span>
            <input value={e.complemento} onChange={set('complemento')} className={campo} />
          </label>
        </div>
        {erro && <p className="mt-3 text-sm text-amber-700">{erro}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {inicial ? (
            <button type="button" onClick={() => onSalvar(null)} className="text-sm font-medium text-navy-500 hover:text-red-600">
              Remover endereço
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn-accent">
            Salvar endereço
          </button>
        </div>
      </form>
    </div>
  )
}
