import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  const target = parseInt(value, 10) || 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let started = false
    let raf

    const run = () => {
      if (started) return
      started = true
      const duration = 1400
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(eased * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    // Já visível (ex.: tela grande ou acesso direto)? Anima de imediato.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) {
      run()
    } else if (typeof IntersectionObserver === 'undefined') {
      run()
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run()
            io.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      io.observe(el)
      return () => {
        io.disconnect()
        if (raf) cancelAnimationFrame(raf)
      }
    }
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="section-pad relative z-20 -mt-14">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-100 shadow-lift lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center gap-1 bg-white px-6 py-8 text-center"
            >
              <span className="font-display text-4xl font-extrabold text-navy-800 sm:text-5xl">
                {s.raw ? (
                  <>
                    {s.valor}
                    {s.sufixo}
                  </>
                ) : (
                  <Counter value={s.valor} suffix={s.sufixo} />
                )}
              </span>
              <span className="text-sm font-medium text-navy-600/80">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
