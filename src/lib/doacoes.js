// Painel de doações da Lei de Incentivo. Mesma regra da função doacoes_publicas()
// do Supabase (supabase/doacoes.sql), usada quando o site roda sem Supabase:
// esconde o nome das doações anônimas e o valor de quem não quis mostrar.
export function resumoPublico(lista = []) {
  const itens = [...lista]
    .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
    .map((d) => ({
      id: d.id,
      nome: d.anonimo ? null : d.nome,
      tipo: d.tipo,
      data: d.data,
      valor: d.mostrarValor ? Number(d.valor) || 0 : null,
    }))
  return {
    itens,
    total: lista.reduce((t, d) => t + (Number(d.valor) || 0), 0),
    quantidade: lista.length,
    atualizadoEm: lista.reduce((m, d) => (d.atualizadoEm > m ? d.atualizadoEm : m), '') || null,
  }
}

export const TIPOS_DOADOR = { pf: 'Pessoa física', pj: 'Empresa' }

// '2026-10-28' → '28/10/2026' (sem passar por Date, para não mudar o dia pelo fuso).
export function dataBR(iso) {
  const [a, m, d] = (iso || '').slice(0, 10).split('-')
  return a && m && d ? `${d}/${m}/${a}` : ''
}

// Data de hoje no fuso de quem está usando (AAAA-MM-DD).
export const hojeISO = () => new Date().toLocaleDateString('sv-SE')
