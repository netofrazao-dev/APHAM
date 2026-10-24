// Funções de data do calendário (faixa "Próximos eventos" da home e agenda completa).
// Cada evento: { data: 'AAAA-MM-DD', fim?: 'AAAA-MM-DD', titulo, local?, tipo?, cor? }.

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
export const MESES_CURTOS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

// Cores das categorias (mesmos ids usados no painel admin).
export const CORES = {
  cyan: 'bg-cyan-500 text-white',
  amber: 'bg-amber-500 text-navy-950',
  red: 'bg-red-600 text-white',
  green: 'bg-[#2faa3a] text-white',
  blue: 'bg-blue-600 text-white',
  purple: 'bg-purple-600 text-white',
}
export const corDe = (e) => CORES[e?.cor] || CORES.cyan

export function parseData(s) {
  const [a, m, d] = (s || '').split('-').map(Number)
  return a && m && d ? { a, m: m - 1, d } : null
}

// Data local no formato AAAA-MM-DD (para comparar com as datas dos eventos).
export function isoLocal(dt = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
}

// Expande cada evento (inclui intervalos com `fim`) para ocorrências por dia,
// agrupadas pela chave "ano-mes-dia" (mês começando em 0).
export function ocorrenciasPorDia(eventos) {
  const map = {}
  for (const e of eventos || []) {
    const ini = parseData(e.data)
    if (!ini) continue
    const fim = parseData(e.fim) || ini
    const end = new Date(fim.a, fim.m, fim.d)
    for (let dt = new Date(ini.a, ini.m, ini.d); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const k = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
      ;(map[k] = map[k] || []).push(e)
    }
  }
  return map
}
