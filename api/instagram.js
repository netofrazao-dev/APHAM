// Função de servidor (Vercel): busca os últimos posts do Instagram da APHAM
// pela Graph API. Configure INSTAGRAM_TOKEN e INSTAGRAM_USER_ID no Vercel.
// Enquanto não estiver configurado, responde com lista vazia (sem erro) e o
// site continua mostrando as novidades cadastradas no painel.
export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID
  if (!token || !userId) {
    return res.status(200).json({ ok: false, skipped: true, posts: [] })
  }
  try {
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
    const r = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=12&access_token=${token}`
    )
    const data = await r.json().catch(() => ({}))
    if (!r.ok) return res.status(502).json({ ok: false, error: data, posts: [] })
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    return res.status(200).json({ ok: true, posts: data.data || [] })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e), posts: [] })
  }
}
