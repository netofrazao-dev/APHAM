import { useState } from 'react'
import { MapPin, Mail, Phone, Send, Check } from 'lucide-react'
import { contato, site } from '../data/content'
import { useStore } from '../store/StoreContext'
import { useToast } from './Toast'
import { notifyEmail } from '../lib/notify'
import Reveal from './Reveal'
import Icon from './Icon'

export default function Contact() {
  const { addMensagem } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const [enviado, setEnviado] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    if (e.target.website && e.target.website.value) return // honeypot anti-spam
    // Salva a mensagem na caixa de entrada do painel (admin). Quando ligarmos o
    // e-mail automático, também disparamos um e-mail para a associação.
    addMensagem({ nome: form.nome, email: form.email, mensagem: form.mensagem })
    notifyEmail({
      assunto: `Nova mensagem de ${form.nome} — site APHAM`,
      texto: `${form.mensagem}\n\n— ${form.nome} (${form.email})`,
    })
    setForm({ nome: '', email: '', mensagem: '' })
    setEnviado(true)
    toast('Mensagem enviada! 🙌')
    setTimeout(() => setEnviado(false), 5000)
  }

  const detalhes = [
    { icone: MapPin, label: 'Endereço', valor: site.endereco },
    { icone: Mail, label: 'E-mail', valor: site.email },
    { icone: Phone, label: 'Telefone', valor: site.telefone },
  ]

  return (
    <section id="contato" className="section-pad py-24 lg:py-28">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-cyan-400" />
              {contato.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              {contato.titulo}
            </h2>
            <p className="mt-4 max-w-md text-ink/70">
              Quer treinar, apoiar ou saber mais sobre a APHAM? Deixe sua mensagem ou fale pelas
              nossas redes.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {detalhes.map((d) => (
              <Reveal key={d.label}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                    <d.icone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">{d.label}</p>
                    <p className="text-base text-ink/80">{d.valor}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-8 flex gap-3">
              {contato.redes.map((r) => (
                <a
                  key={r.nome}
                  href={r.url}
                  target={r.url.startsWith('http') ? '_blank' : undefined}
                  rel={r.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={r.nome}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-700 transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:text-white"
                >
                  <Icon name={r.icone} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8">
            {enviado && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">
                <Check className="h-4 w-4" /> Recebemos sua mensagem! Em breve a APHAM responde.
              </div>
            )}
            <div className="space-y-5">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold text-navy-800">Nome</label>
                <input id="nome" name="nome" type="text" required value={form.nome} onChange={onChange} placeholder="Seu nome" className="w-full rounded-xl border border-navy-200 bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-800">E-mail</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="voce@email.com" className="w-full rounded-xl border border-navy-200 bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label htmlFor="mensagem" className="mb-1.5 block text-sm font-semibold text-navy-800">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows={4} required value={form.mensagem} onChange={onChange} placeholder="Como podemos ajudar?" className="w-full resize-none rounded-xl border border-navy-200 bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Enviar mensagem
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
