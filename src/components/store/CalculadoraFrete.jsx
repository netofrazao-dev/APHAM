import { useEffect, useState } from 'react'
import { Loader2, Truck } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatBRL } from '../../store/format'
import { formatarCep, buscarCep, ehBreves, enderecoVazio } from '../../store/entrega'
import { useFrete, prazoTexto } from '../../store/frete'

// Simulação do frete no carrinho. O CEP é o mesmo da faixa "Enviar para": fica
// salvo neste aparelho e o endereço já vem preenchido no checkout.
export default function CalculadoraFrete({ itens }) {
  const { enderecoEntrega, salvarEnderecoEntrega, settings } = useStore()
  const [cep, setCep] = useState(formatarCep(enderecoEntrega?.cep))
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')
  // Acompanha o CEP trocado pela faixa "Enviar para" (também aparece no carrinho).
  useEffect(() => setCep(formatarCep(enderecoEntrega?.cep)), [enderecoEntrega?.cep])
  const salvo = enderecoEntrega?.cep && formatarCep(enderecoEntrega.cep) === cep ? enderecoEntrega : null
  const breves = Boolean(salvo) && ehBreves(salvo)
  const cotacao = useFrete(salvo ? cep : '', itens, Boolean(salvo) && !breves)
  const taxaBreves = Number(settings.entregaTaxa) || 0

  const mudarCep = async (valor) => {
    const novo = formatarCep(valor)
    setCep(novo)
    setErro('')
    if (novo.replace(/\D/g, '').length !== 8 || novo === formatarCep(enderecoEntrega?.cep)) return
    setBuscando(true)
    const r = await buscarCep(novo)
    setBuscando(false)
    if (!r) return setErro('CEP não encontrado. Confira os números.')
    salvarEnderecoEntrega({ ...enderecoVazio(), ...r, cep: novo })
  }

  return (
    <div className="mt-4 border-t border-navy-100 pt-4">
      <label htmlFor="cep-frete" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-navy-800">
        <Truck className="h-4 w-4 text-cyan-600" />
        Calcular o frete
      </label>
      <div className="relative">
        <input
          id="cep-frete"
          inputMode="numeric"
          autoComplete="postal-code"
          value={cep}
          onChange={(e) => mudarCep(e.target.value)}
          placeholder="Seu CEP"
          className="w-full rounded-lg border border-navy-200 bg-paper px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:bg-white"
        />
        {buscando && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-navy-400" />}
      </div>
      {erro && <p className="mt-1.5 text-xs text-amber-700">{erro}</p>}

      {breves ? (
        <p className="mt-2 text-xs text-navy-600">
          Em Breves: retirada grátis com a APHAM ou entrega na sua casa{taxaBreves > 0 ? ` (${formatBRL(taxaBreves)})` : ''}.
        </p>
      ) : cotacao.carregando ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-navy-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Calculando…
        </p>
      ) : cotacao.opcoes.length ? (
        <ul className="mt-2 space-y-1.5">
          {cotacao.opcoes.map((o) => (
            <li key={o.id} className="flex items-start justify-between gap-3 text-xs">
              <span className="text-navy-700">
                {o.nome}
                {o.prazo && <span className="block text-navy-400">{prazoTexto(o.prazo)}</span>}
              </span>
              <span className="font-semibold text-navy-900">{formatBRL(o.preco)}</span>
            </li>
          ))}
          <li className="pt-1 text-xs text-navy-400">Você escolhe o envio no checkout.</li>
        </ul>
      ) : salvo ? (
        <p className="mt-2 text-xs text-navy-500">Enviamos para todo o Brasil. O frete é calculado depois da compra, pelo seu CEP.</p>
      ) : null}
    </div>
  )
}
