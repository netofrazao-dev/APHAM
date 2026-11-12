import { Code2, ArrowUpRight } from 'lucide-react'

// Selo "Site desenvolvido por Neto Frazão" (rodapé do site e da loja).
// claro = para fundo claro (rodapé da loja); sem ele, para o fundo azul do site.
export default function CreditoDev({ claro = false }) {
  const cores = claro
    ? {
        selo: 'border-navy-200 bg-white text-navy-500 hover:border-cyan-400 hover:text-navy-800',
        icone: 'text-cyan-600',
        nome: 'text-navy-900 group-hover:text-cyan-700',
        seta: 'text-navy-300 group-hover:text-cyan-700',
      }
    : {
        selo: 'border-white/15 bg-white/5 text-white/60 hover:border-cyan-400/60 hover:bg-white/10 hover:text-white',
        icone: 'text-cyan-400',
        nome: 'text-white group-hover:text-cyan-300',
        seta: 'text-white/40 group-hover:text-cyan-300',
      }
  return (
    <a
      href="https://netofrazao.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors ${cores.selo}`}
    >
      <Code2 className={`h-4 w-4 ${cores.icone}`} />
      Site desenvolvido por
      <span className={`font-semibold ${cores.nome}`}>Neto Frazão</span>
      <ArrowUpRight className={`h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${cores.seta}`} />
    </a>
  )
}
