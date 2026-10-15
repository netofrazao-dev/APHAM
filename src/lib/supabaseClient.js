import { createClient } from '@supabase/supabase-js'

// Lê as credenciais públicas do Supabase das variáveis de ambiente (Vite).
// Enquanto não estiverem configuradas, o app continua usando o localStorage.
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseEnabled = Boolean(url && anon)

export const supabase = isSupabaseEnabled ? createClient(url, anon) : null
