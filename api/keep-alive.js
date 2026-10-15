// Função de servidor (Vercel): "cutuca" o Supabase para ele não pausar após
// 7 dias de inatividade. O vercel.json agenda isto automaticamente (cron).
export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY
  if (!url || !anon) {
    return res.status(200).json({ ok: false, skipped: true, reason: 'Supabase não configurado' })
  }
  try {
    const r = await fetch(`${url}/rest/v1/settings?select=id&limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    })
    return res.status(200).json({ ok: r.ok, status: r.status, at: new Date().toISOString() })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) })
  }
}
