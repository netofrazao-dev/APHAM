import { Mail, MailOpen, Trash2, Reply } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { PageTitle, Card } from './ui'

export default function MessagesAdmin() {
  const { mensagens, markMensagem, deleteMensagem } = useStore()

  return (
    <div>
      <PageTitle title="Mensagens" subtitle="Contatos recebidos pelo site" />

      {mensagens.length === 0 ? (
        <Card className="text-sm text-navy-500">Nenhuma mensagem ainda.</Card>
      ) : (
        <div className="space-y-3">
          {mensagens.map((m) => (
            <Card key={m.id} className={m.lida ? '' : 'border-cyan-200 bg-cyan-50/40'}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.lida ? <MailOpen className="h-4 w-4 text-navy-400" /> : <Mail className="h-4 w-4 text-cyan-600" />}
                    <h3 className="font-display text-sm font-bold text-navy-900">{m.nome}</h3>
                    {!m.lida && <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white">nova</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-navy-500">
                    {m.email} · {new Date(m.data).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button type="button" onClick={() => markMensagem(m.id, !m.lida)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label={m.lida ? 'Marcar como não lida' : 'Marcar como lida'}>
                    {m.lida ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  {m.email && (
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: contato APHAM')}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Responder por e-mail">
                      <Reply className="h-4 w-4" />
                    </a>
                  )}
                  <button type="button" onClick={() => window.confirm('Excluir esta mensagem?') && deleteMensagem(m.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Excluir">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap border-t border-navy-100 pt-3 text-sm text-navy-700">{m.mensagem}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
