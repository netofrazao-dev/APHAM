// Acesso ao Supabase pelo servidor (Vercel), com a chave service_role.
// A chave fica SÓ nas variáveis de ambiente do Vercel (nunca no navegador).
const base = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseOk = () => Boolean(base() && chave())

export async function sb(caminho, { method = 'GET', body, prefer } = {}) {
  const r = await fetch(`${base()}/rest/v1/${caminho}`, {
    method,
    headers: {
      apikey: chave(),
      // Chave antiga (JWT "eyJ...") vai também no Authorization; a nova
      // ("sb_secret_...") vale só no apikey.
      ...(chave().startsWith('sb_') ? {} : { Authorization: `Bearer ${chave()}` }),
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`)
  const txt = await r.text()
  return txt ? JSON.parse(txt) : null
}

// Lista para filtros "in.(...)" do PostgREST, com aspas e escape.
export const emLista = (valores) =>
  encodeURIComponent(`(${valores.map((v) => `"${String(v).replace(/["\\]/g, '\\$&')}"`).join(',')})`)

export async function lerPedido(id) {
  const [row] = await sb(`pedidos?select=id,numero,status,data&id=eq.${encodeURIComponent(id)}`)
  return row || null
}

// Confere se quem chamou é admin: o navegador manda o token de login do Supabase
// (Authorization: Bearer ...); o servidor pergunta ao Supabase de quem é e olha
// a tabela admins. Devolve o id do usuário ou null.
export async function usuarioAdmin(req) {
  const auth = String(req.headers?.authorization || '')
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!jwt || !supabaseOk()) return null
  try {
    const apikey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || chave()
    const r = await fetch(`${base()}/auth/v1/user`, { headers: { apikey, Authorization: `Bearer ${jwt}` } })
    if (!r.ok) return null
    const u = await r.json()
    if (!u?.id) return null
    const rows = await sb(`admins?select=user_id&user_id=eq.${encodeURIComponent(u.id)}`)
    return rows?.length ? u.id : null
  } catch {
    return null
  }
}
