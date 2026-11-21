import { supabase } from './supabaseClient'

// Etiqueta do Melhor Envio pelo painel (api/envio.js). Vai com o login do admin.
export async function acaoEnvio(acao, dados = {}) {
  const { data } = (await supabase?.auth.getSession()) || {}
  const token = data?.session?.access_token
  if (!token) throw new Error('Entre no painel de novo (login expirado).')
  let r
  try {
    r = await fetch('/api/envio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ acao, ...dados }),
    })
  } catch {
    throw new Error('Sem conexão com o servidor. Tente de novo.')
  }
  const j = await r.json().catch(() => ({}))
  if (!r.ok || !j.ok) throw new Error(j.erro || `Erro ${r.status} (só funciona no site publicado).`)
  return j
}
