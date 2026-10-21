import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'

// ============================================================================
//  Sincronização com o Supabase.
//  Cada tabela guarda o objeto completo na coluna `data` (jsonb). Todas as
//  funções são "à prova de falha": se o Supabase não estiver ligado ou der
//  erro, elas não quebram o app (que segue funcionando com o localStorage).
// ============================================================================

const on = () => isSupabaseEnabled && supabase

// Lê todos os registros de uma tabela (retorna array de objetos) ou null em erro.
export async function sbSelect(table) {
  if (!on()) return null
  try {
    const { data, error } = await supabase.from(table).select('data')
    if (error) return null
    return (data || []).map((r) => r.data)
  } catch {
    return null
  }
}

export async function sbSelectSettings() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 1).maybeSingle()
    if (error || !data) return null
    return data.data
  } catch {
    return null
  }
}

// Insere/atualiza um registro (fire-and-forget).
export async function sbUpsert(table, item, extra = {}) {
  if (!on()) return
  try {
    await supabase.from(table).upsert({ id: item.id, data: item, ...extra })
  } catch {
    /* ignora */
  }
}

export async function sbDelete(table, id) {
  if (!on()) return
  try {
    await supabase.from(table).delete().eq('id', id)
  } catch {
    /* ignora */
  }
}

export async function sbUpsertSettings(settings) {
  if (!on()) return
  try {
    await supabase.from('settings').upsert({ id: 1, data: settings })
  } catch {
    /* ignora */
  }
}

// Envia TODO o conteúdo atual para o Supabase (primeira carga / migração).
// Só funciona logado como admin (as permissões exigem autenticação).
export async function sbSeedAll({ produtos, categorias, cupons, novidades, stories, lives, settings }) {
  if (!on()) return { ok: false }
  try {
    const up = (table, arr) =>
      arr && arr.length ? supabase.from(table).upsert(arr.map((x) => ({ id: x.id, data: x }))) : null
    await up('produtos', produtos)
    await up('categorias', categorias)
    await up('cupons', cupons)
    await up('novidades', novidades)
    await up('stories', stories)
    await up('lives', lives)
    if (settings) await supabase.from('settings').upsert({ id: 1, data: settings })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
