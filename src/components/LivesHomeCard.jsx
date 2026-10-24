import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle, ArrowUpRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import Reveal from './Reveal'

const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
const TROCA_MS = 7000

// Faixa das Lives na rolagem da home, de canto a canto: a capa do jogo em
// destaque (desfocada) ao fundo, o jogo grande na frente e miniaturas de outros
// jogos para trocar o destaque. O destaque troca sozinho e também a cada vez que
// a faixa aparece; clicar no jogo leva para a subpágina /lives.
export default function LivesHomeCard() {
  const { lives } = useStore()
  const lista = (lives || []).slice(0, 12)
  const ref = useRef(null)
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, lista.length)))
  const [visivel, setVisivel] = useState(false)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || lista.length <= 1) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setVisivel(e.isIntersecting)
          if (e.isIntersecting) {
            setI((prev) => {
              let n = Math.floor(Math.random() * lista.length)
              if (n === prev) n = (n + 1) % lista.length
              return n
            })
          }
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [lista.length])

  // Troca automática enquanto a faixa está na tela (pausa com o mouse em cima).
  useEffect(() => {
    if (!visivel || pausado || lista.length <= 1) return
    const id = setInterval(() => setI((p) => (p + 1) % lista.length), TROCA_MS)
    return () => clearInterval(id)
  }, [visivel, pausado, lista.length, i])

  if (!lista.length) return null
  const atual = i % lista.length
  const j = lista[atual]
  // Os próximos jogos da lista, para a fileira de miniaturas.
  const outros = Array.from({ length: Math.min(5, lista.length - 1) }, (_, k) => (atual + 1 + k) % lista.length)

  return (
    <section
      id="lives"
      ref={ref}
      className="relative overflow-hidden bg-navy-950 py-20 lg:py-24"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Fundo: capa do jogo em destaque, desfocada, trocando com fade */}
      {lista.map((g, idx) => (
        <img
          key={g.id}
          src={thumb(g.id)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-1000"
          style={{ opacity: idx === atual ? 0.55 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/70 to-navy-950" />
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="section-pad relative mx-auto w-full max-w-[90rem]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Texto */}
          <Reveal className="text-center lg:col-span-5">
            <span className="eyebrow flex justify-center text-red-400">
              <span className="h-px w-6 bg-red-500" />
              Lives APHAM
              <span className="h-px w-6 bg-red-500" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Reveja os jogos da APHAM
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/70">
              Os jogos transmitidos ao vivo pela associação, no nosso canal do YouTube. Um jogo diferente a cada visita.
            </p>
            <div className="mx-auto mt-8 hidden max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-left backdrop-blur-sm lg:block">
              <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Em destaque{j.torneio ? ` · ${j.torneio}` : ''}
              </span>
              <p className="mt-1 line-clamp-2 font-display text-lg font-bold text-white">{j.titulo}</p>
            </div>
            <Link to="/lives" className="btn-accent mt-8">
              Ver todas as lives
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Jogo em destaque + miniaturas */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <Link
              to="/lives"
              aria-label={`Assistir: ${j.titulo}`}
              className="group relative block aspect-video overflow-hidden rounded-2xl bg-navy-900 shadow-lift ring-1 ring-white/15"
            >
              {lista.map((g, idx) => (
                <img
                  key={g.id}
                  src={thumb(g.id)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ opacity: idx === atual ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Lives APHAM
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
                  <PlayCircle className="h-10 w-10" />
                </span>
              </span>
              <p className="absolute inset-x-0 bottom-0 line-clamp-1 p-5 font-display text-base font-bold text-white sm:text-lg">{j.titulo}</p>
            </Link>

            {outros.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
                {outros.map((idx) => (
                  <button
                    key={lista[idx].id}
                    type="button"
                    onClick={() => setI(idx)}
                    title={lista[idx].titulo}
                    aria-label={`Destacar: ${lista[idx].titulo}`}
                    className="group relative aspect-video overflow-hidden rounded-lg ring-1 ring-white/15 transition hover:ring-cyan-400"
                  >
                    <img
                      src={thumb(lista[idx].id)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
