// Função de servidor (Vercel): envia e-mail à APHAM em novos pedidos/mensagens.
// Usa o Resend. Configure RESEND_API_KEY, NOTIFY_EMAIL e NOTIFY_FROM no Vercel.
// Enquanto não estiver configurado, responde sem erro (apenas "ignorado").
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido' })
  }
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.NOTIFY_FROM || 'APHAM <onboarding@resend.dev>'

  if (!key || !to) {
    return res.status(200).json({ ok: false, skipped: true, reason: 'e-mail ainda não configurado' })
  }

  try {
    const { assunto, texto, html } = req.body || {}
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: assunto || 'Nova atividade — site da APHAM',
        text: texto || '',
        html: html || undefined,
      }),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) return res.status(502).json({ ok: false, error: data })
    return res.status(200).json({ ok: true, id: data.id })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
