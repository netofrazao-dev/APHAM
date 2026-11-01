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
      Authorization: `Bearer ${chave()}`,
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
