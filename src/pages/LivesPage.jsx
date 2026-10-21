import { Youtube } from 'lucide-react'
import PageShell from '../components/PageShell'
import LiveGameCard from '../components/LiveGameCard'
import { livesInfo } from '../data/content'
import { useStore } from '../store/StoreContext'

export default function LivesPage() {
  const { lives } = useStore()
  // Agrupa os jogos por torneio, preservando a ordem.
  const torneios = []
  for (const j of lives) {
    let g = torneios.find((t) => t.nome === j.torneio)
    if (!g) {
      g = { nome: j.torneio, jogos: [] }
      torneios.push(g)
    }
    g.jogos.push(j)
  }

  return (
    <PageShell eyebrow={livesInfo.eyebrow} titulo={livesInfo.titulo} descricao={livesInfo.intro}>
      <section className="relative overflow-hidden bg-navy-950 py-16 lg:py-20">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="section-pad container-x relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              {lives.length} jogos transmitidos pela APHAM. Clique para assistir aqui mesmo.
            </p>
            <a href={livesInfo.canal} target="_blank" rel="noopener noreferrer" className="btn-accent">
              <Youtube className="h-4 w-4" />
              Ver no YouTube
            </a>
          </div>

          {torneios.map((t) => (
            <div key={t.nome} className="mt-12 first:mt-10">
              <h2 className="font-display text-xl font-bold text-white">
                {t.nome} <span className="text-white/40">· {t.jogos.length}</span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {t.jogos.map((j) => (
                  <LiveGameCard key={j.id} jogo={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
