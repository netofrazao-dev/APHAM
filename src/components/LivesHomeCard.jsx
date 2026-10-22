import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle, ArrowUpRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import Reveal from './Reveal'

// Card compacto das Lives na rolagem da home. Mostra UM jogo (troca a cada vez
// que aparece) e leva para a subpágina /lives com a área completa.
export default function LivesHomeCard() {
  const { lives } = useStore()
  const lista = (lives || []).slice(0, 12)
  const ref = useRef(null)
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, lista.length)))

  useEffect(() => {
    const el = ref.current
    if (!el || lista.length <= 1) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setI((prev) => {
              let n = Math.floor(Math.random() * lista.length)
              if (n === prev) n = (n + 1) % lista.length
              return n
            })
          }
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [lista.length])

  if (!lista.length) return null
  const j = lista[i % lista.length]

  return (
    <section id="lives" className="section-pad pb-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-xl">
          <div ref={ref}>
            <Link
              to="/lives"
              className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
                {lista.map((g, idx) => (
                  <img
                    key={g.id}
                    src={`https://i.ytimg.com/vi/${g.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                    style={{ opacity: idx === i ? 1 : 0 }}
                  />
                ))}
                <div className="absolute inset-0 bg-navy-950/25" />
                <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Lives APHAM</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
                    <PlayCircle className="h-7 w-7" />
                  </span>
                </span>
              </div>
              <div className="flex flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                  Jogos transmitidos{j.torneio ? ` · ${j.torneio}` : ''}
                </span>
                <h3 className="mt-1 line-clamp-2 font-display text-xl font-bold text-navy-900">{j.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Reveja os jogos da APHAM no YouTube — um jogo diferente a cada visita.
                </p>
                <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-cyan-700">
                  Ver as lives <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
