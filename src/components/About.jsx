import { ShieldCheck, CalendarDays, Target, Flag } from 'lucide-react'
import { sobre } from '../data/content'
import Reveal from './Reveal'

const destaqueIcons = [CalendarDays, ShieldCheck]

export default function About() {
  return (
    <section id="sobre" className="section-pad py-24 lg:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Foto real */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-lift">
                <img
                  src="/midia/fotos/foto6.jpeg"
                  alt="Oficina pedagógica de iniciação ao handebol da APHAM"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              {/* Selos flutuantes */}
              <div className="absolute -bottom-6 -right-3 flex flex-col gap-3 sm:-right-6">
                {sobre.destaques.map((d, i) => {
                  const IconCmp = destaqueIcons[i] || ShieldCheck
                  return (
                    <div
                      key={d.titulo}
                      className="flex max-w-[230px] items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-lift"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                        <IconCmp className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-navy-800">{d.titulo}</p>
                        <p className="mt-0.5 text-xs text-navy-600/80">{d.texto}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-6 bg-cyan-400" />
                {sobre.eyebrow}
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-4xl">
                {sobre.titulo}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4">
              {sobre.paragrafos.map((p, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <p className="text-base leading-relaxed text-ink/75">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Missão e Lema */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-24">
          <Reveal>
            <div className="h-full rounded-3xl border border-navy-100 bg-white p-8 shadow-soft">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                <Target className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">Nossa missão</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{sobre.missao}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 shadow-lift">
              <div className="absolute inset-0 dot-grid opacity-20" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Flag className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.15em] text-cyan-300">
                  Nosso lema
                </h3>
                <p className="mt-2 font-display text-2xl font-extrabold text-white">
                  {sobre.lemaTitulo}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{sobre.lema}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Nossos projetos */}
        {sobre.projetos?.length > 0 && (
          <Reveal>
            <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-navy-100 bg-white px-6 py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-500">
                Nossos projetos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-10">
                {sobre.projetos.map((p) => (
                  <img
                    key={p.nome}
                    src={p.logo}
                    alt={p.nome}
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
