import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'

// ============================================================================
//  Sincronização com o Supabase.
//  Cada tabela guarda o objeto completo na coluna `data` (jsonb). Todas as
//  funções são "à prova de falha": se o Supabase não estiver ligado ou der
//  erro, elas não quebram o app (que segue funcionando com o localStorage).
// ============================================================================

const on = () => isSupabaseEnabled && supabase

// Lê todos os registros de uma tabela (retorna array de objetos) ou null em erro.
// orderBy: coluna opcional para ordenar de forma estável (ex.: 'created_at').
export async function sbSelect(table, orderBy) {
  if (!on()) return null
  try {
    let q = supabase.from(table).select('data')
    if (orderBy) q = q.order(orderBy, { ascending: true })
    const { data, error } = await q
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

// Insere/atualiza um registro. Devolve true/false (ou undefined sem Supabase);
// a maioria das telas ignora o resultado (fire-and-forget).
export async function sbUpsert(table, item, extra = {}) {
  if (!on()) return
  try {
    const { error } = await supabase.from(table).upsert({ id: item.id, data: item, ...extra })
    return !error
  } catch {
    return false
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

// ----------------------------------------------------------------------------
//  Lojas parceiras (marketplace) — ver supabase/lojas-parceiras.sql
// ----------------------------------------------------------------------------

// Produtos com a loja dona (coluna loja_id é a fonte da verdade).
export async function sbSelectProdutos() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.from('produtos').select('data, loja_id')
    if (error) {
      // Banco ainda sem a coluna loja_id (script das lojas não rodado): lê do jeito antigo.
      return sbSelect('produtos')
    }
    return (data || []).map((r) => ({ ...r.data, lojaId: r.loja_id || null }))
  } catch {
    return null
  }
}

// É admin de verdade? null = não deu para saber (script das lojas não rodado).
export async function sbIsAdmin() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.rpc('is_admin')
    if (error) return null
    return !!data
  } catch {
    return null
  }
}

const lojaDaLinha = (r) => ({ ...(r.data || {}), id: r.id, dono: r.dono, status: r.status, criadaEm: r.created_at })

// Lojas visíveis para quem está acessando (visitante: aprovadas; lojista: + a
// sua; admin: todas). null = tabela ainda não existe.
export async function sbSelectLojas() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.from('lojas').select('id, dono, status, data, created_at').order('created_at')
    if (error) return null
    return (data || []).map(lojaDaLinha)
  } catch {
    return null
  }
}

export async function sbInsertLoja(dono, dados) {
  const { data, error } = await supabase.from('lojas').insert({ dono, data: dados }).select('id, dono, status, data, created_at').single()
  if (error) throw error
  return lojaDaLinha(data)
}

export async function sbUpdateLoja(id, patch) {
  const { data, error } = await supabase.from('lojas').update(patch).eq('id', id).select('id, dono, status, data, created_at').single()
  if (error) throw error
  return lojaDaLinha(data)
}

export async function sbSelectRepasses() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.from('repasses').select('id, loja_id, valor, data, created_at').order('created_at', { ascending: false })
    if (error) return null
    return (data || []).map((r) => ({ ...(r.data || {}), id: r.id, lojaId: r.loja_id, valor: Number(r.valor), criadoEm: r.created_at }))
  } catch {
    return null
  }
}

export async function sbInsertRepasse(r) {
  const { data, error } = await supabase
    .from('repasses')
    .insert({ loja_id: r.lojaId, valor: r.valor, data: { obs: r.obs || '', dataPagamento: r.dataPagamento || '' } })
    .select('id, loja_id, valor, data, created_at')
    .single()
  if (error) throw error
  return { ...(data.data || {}), id: data.id, lojaId: data.loja_id, valor: Number(data.valor), criadoEm: data.created_at }
}

// Painel de doações: o que o site pode mostrar (função do supabase/doacoes.sql).
// null = Supabase desligado ou script ainda não rodado.
export async function sbDoacoesPublicas() {
  if (!on()) return null
  try {
    const { data, error } = await supabase.rpc('doacoes_publicas')
    if (error || !data) return null
    return { ...data, total: Number(data.total) || 0 }
  } catch {
    return null
  }
}
