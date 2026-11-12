import { supabaseOk, sb, emLista } from './_lib/supabase.js'
import { freteConfigurado, freteAtivo, cotarFrete } from './_lib/frete.js'
import { precoDeVenda } from './_lib/pedido.js'

// Opções de frete (Melhor Envio) para o carrinho e um CEP. O navegador manda só
// os produtos e as quantidades; peso, medidas e preços vêm do banco.
// GET: só diz ao painel se o token do Melhor Envio está configurado.
// Sem token, desligado no painel ou com o Melhor Envio fora do ar, responde
// { automatico: false } e a loja segue com o frete calculado depois.
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, configurado: freteConfigurado(), sandbox: process.env.MELHOR_ENVIO_SANDBOX === 'true' })
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' })

  const cep = String(req.body?.cep ?? '').replace(/\D/g, '')
  if (cep.length !== 8) return res.status(400).json({ ok: false, erro: 'Informe um CEP com 8 números.' })
  const itensIn = Array.isArray(req.body?.itens) ? req.body.itens.slice(0, 50) : []
  if (!itensIn.length) return res.status(400).json({ ok: false, erro: 'Carrinho vazio.' })
  if (!freteConfigurado() || !supabaseOk()) return res.status(200).json({ ok: true, automatico: false })

  try {
    const ids = [...new Set(itensIn.map((i) => String(i?.id ?? '').slice(0, 120)).filter(Boolean))]
    const [produtosRows, settingsRows] = await Promise.all([
      sb(`produtos?select=id,data&id=in.${emLista(ids)}`),
      sb('settings?select=data&id=eq.1'),
    ])
    const settings = settingsRows?.[0]?.data || {}
    if (!freteAtivo(settings)) return res.status(200).json({ ok: true, automatico: false })
    const produtos = Object.fromEntries(produtosRows.map((r) => [r.id, { ...r.data, id: r.id }]))
    const itens = itensIn
      .map((i) => ({ produto: produtos[String(i?.id ?? '')], qtd: Math.floor(Number(i?.qtd)) }))
      .filter((i) => i.produto && i.produto.ativo !== false && i.qtd >= 1 && i.qtd <= 99)
      .map((i) => ({ ...i, preco: precoDeVenda(i.produto, settings) }))
    if (!itens.length) return res.status(400).json({ ok: false, erro: 'Nenhum produto disponível no carrinho.' })

    const opcoes = await cotarFrete({ cep, itens, settings })
    return res.status(200).json({ ok: true, automatico: true, opcoes })
  } catch (e) {
    console.error('frete', e)
    return res.status(200).json({ ok: true, automatico: false, falhou: true })
  }
}
