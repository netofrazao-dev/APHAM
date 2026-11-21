import { participar, eventos, faq, sobre, site } from '../data/content'

// Conteúdo que o admin edita pelo painel (fica em settings no banco). Enquanto
// nada foi salvo, vale o texto do código (src/data/content.js).

export const conteudoParticipar = (settings) => ({ ...participar, ...(settings?.participar || {}) })
export const listaEventos = (settings) => settings?.eventos ?? eventos
export const listaFaq = (settings) => settings?.faq ?? faq
export const conteudoSobre = (settings) => ({ ...sobre, ...(settings?.sobre || {}) })

// Link do WhatsApp da APHAM: o número do painel (Configurações) ou o do código.
export function linkWhatsApp(settings, texto = '') {
  const num = String(settings?.whatsapp || site.whatsappNumero || '').replace(/\D/g, '')
  if (!num) return site.whatsapp
  return `https://wa.me/${num}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
}
