// Dispara um e-mail de aviso para a APHAM (via /api/notify no Vercel).
// Nunca lança erro nem bloqueia a interface: se o e-mail ainda não estiver
// configurado (ou em desenvolvimento), simplesmente não faz nada.
export function notifyEmail({ assunto, texto }) {
  try {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assunto, texto }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* ignora */
  }
}
