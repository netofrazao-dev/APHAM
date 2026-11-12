import { useCallback, useEffect, useRef, useState } from 'react'

// Frete automático: o servidor (/api/frete) cota no Melhor Envio com o peso, as
// medidas e os preços do banco. Sem cotação — token ainda não configurado, CEP
// sem atendimento, Melhor Envio fora do ar ou no `npm run dev` (que não roda as
// funções da Vercel) — vem automatico=false e a loja segue como antes: a APHAM
// calcula o frete depois da compra.
export async function buscarFrete(cep, cart) {
  try {
    const r = await fetch('/api/frete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep, itens: cart.map(({ id, qtd }) => ({ id, qtd })) }),
    })
    const j = await r.json()
    if (!r.ok || !j.ok) return { automatico: false, opcoes: [] }
    return { automatico: Boolean(j.automatico), opcoes: Array.isArray(j.opcoes) ? j.opcoes : [] }
  } catch {
    return { automatico: false, opcoes: [] }
  }
}

export const prazoTexto = (dias) => (dias ? `até ${dias} ${dias === 1 ? 'dia útil' : 'dias úteis'}` : '')

// Cota de novo quando o CEP fica completo ou o carrinho muda (ids e quantidades).
// opcoes: [{ id, nome, preco, prazo }], da mais barata para a mais cara.
export function useFrete(cep, cart, ativo = true) {
  const digitos = String(cep || '').replace(/\D/g, '')
  const chave = ativo && digitos.length === 8 && cart.length ? `${digitos}|${cart.map((i) => `${i.id}:${i.qtd}`).join(',')}` : ''
  const carrinho = useRef(cart)
  carrinho.current = cart
  const [res, setRes] = useState({ chave: '', automatico: false, opcoes: [] })
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    if (!chave) return
    let vivo = true
    const t = setTimeout(async () => {
      const r = await buscarFrete(digitos, carrinho.current)
      if (vivo) setRes({ chave, ...r })
    }, 300)
    return () => {
      vivo = false
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, versao])

  const recarregar = useCallback(() => {
    setRes((r) => ({ ...r, chave: '' }))
    setVersao((v) => v + 1)
  }, [])
  const pronto = Boolean(chave) && res.chave === chave
  return {
    carregando: Boolean(chave) && !pronto,
    automatico: pronto && res.automatico,
    opcoes: pronto ? res.opcoes : [],
    recarregar,
  }
}
