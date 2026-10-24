import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import StoryViewer from './StoryViewer'
import Reveal from './Reveal'

// Bolinhas (stories) que abrem em tela cheia. Bloco sem seção própria — o pai
// cuida do espaçamento. Usado na home como "Mais Antigas".
export default function Stories({ titulo = 'Mais Antigas', subtitulo = 'Toque para ver em tela cheia.' }) {
  const { stories } = useStore()
  const [storyIdx, setStoryIdx] = useState(null)
  const nav = (dir) =>
    setStoryIdx((i) => (i === null ? i : (i + dir + stories.length) % stories.length))

  if (!stories.length) return null

  return (
    <div>
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{titulo}</h2>
          <p className="mt-2 text-ink/70">{subtitulo}</p>
        </div>
        <Link to="/posts-anteriores" className="btn-ghost shrink-0">
          Ver todas <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <Reveal>
        <div className="mt-8 flex gap-5 overflow-x-auto pb-3">
          {stories.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStoryIdx(i)}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <span className="rounded-full bg-gradient-to-tr from-cyan-500 to-navy-500 p-[3px]">
                <span className="block rounded-full bg-paper p-[3px]">
                  <img src={s.img} alt={s.titulo} loading="lazy" decoding="async" className="h-20 w-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </span>
              </span>
              <span className="max-w-[88px] truncate text-xs font-medium text-navy-700">{s.titulo}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {storyIdx !== null && (
        <StoryViewer index={storyIdx} stories={stories} onClose={() => setStoryIdx(null)} onNav={nav} />
      )}
    </div>
  )
}
