// Formas de entrega da loja e o endereço do cliente.
// "envio" = para todo o Brasil: o frete é calculado depois da compra (pelo CEP)
// e a APHAM informa o valor pelo WhatsApp, para pagar à parte.
export const ENTREGAS = [
  { id: 'retirada', rotulo: 'Retirar com a APHAM', detalhe: 'Em Breves (PA), sem custo' },
  { id: 'entrega', rotulo: 'Entrega em Breves', detalhe: 'Na sua casa, em Breves (PA)' },
  { id: 'envio', rotulo: 'Envio para todo o Brasil', detalhe: 'Frete calculado depois da compra' },
]

export const precisaEndereco = (entrega) => entrega === 'entrega' || entrega === 'envio'

export const enderecoVazio = () => ({ cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' })

export const formatarCep = (v) => {
  const d = String(v || '').replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

// "Rua X, 123 (apto 2) — Bairro, Cidade/UF — CEP 00000-000"
export function enderecoTexto(e) {
  if (!e) return ''
  const linha1 = [e.rua, e.numero].filter(Boolean).join(', ') + (e.complemento ? ` (${e.complemento})` : '')
  const cidade = [e.cidade, e.uf].filter(Boolean).join('/')
  const linha2 = [e.bairro, cidade].filter(Boolean).join(', ')
  return [linha1, linha2, e.cep && `CEP ${formatarCep(e.cep)}`].filter(Boolean).join(' — ')
}

export function rotuloEntrega(o) {
  if (o?.entrega === 'envio') return 'Envio para o Brasil (frete a calcular)'
  if (o?.entrega === 'entrega') return 'Entrega em Breves'
  return 'Retirada com a APHAM'
}

// Busca rua, bairro, cidade e UF pelo CEP (ViaCEP, gratuito). null se não achar.
export async function buscarCep(cep) {
  const d = String(cep || '').replace(/\D/g, '')
  if (d.length !== 8) return null
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`)
    const j = await r.json()
    if (!r.ok || j.erro) return null
    return { rua: j.logradouro || '', bairro: j.bairro || '', cidade: j.localidade || '', uf: j.uf || '' }
  } catch {
    return null
  }
}
