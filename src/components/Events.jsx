import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Calendar, Plus, Minus } from 'lucide-react'
import { eventos } from '../data/content'
import Reveal from './Reveal'

function EventCard({ ev, index }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={0.06 * index}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition-all duration-300 hover:shadow-lift">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={ev.img}
            alt={ev.nome}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-soft">
            {ev.tag}
          </span>
          <div className="absolute bottom-3 left-4 flex items-center gap-3 text-xs font-medium text-white/90">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {ev.ano}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {ev.local}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-lg font-bold text-navy-900">{ev.nome}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{ev.resumo}</p>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
            aria-expanded={open}
          >
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {open ? 'Fechar história' : 'Ler a história'}
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-4 border-t border-navy-100 pt-4 text-sm leading-relaxed text-ink/70">
                  {ev.historia}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </Reveal>
  )
}

export default function Events() {
  return (
    <section id="eventos" className="section-pad py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow flex justify-center">
            <span className="h-px w-6 bg-cyan-400" />
            Eventos e campeonatos
            <span className="h-px w-6 bg-cyan-400" />
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            A história viva do handebol marajoara
          </h2>
          <p className="mt-4 text-ink/70">
            Campeonatos, oficinas e ações sociais que marcaram a trajetória da APHAM. Cada evento
            carrega uma história de esporte, comunidade e transformação.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((ev, i) => (
            <EventCard key={ev.nome} ev={ev} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
