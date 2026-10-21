-- ============================================================================
--  MIGRAÇÃO — tabela "lives" (Lives APHAM)
--  Rode isto UMA VEZ no Supabase: projeto > SQL Editor > New query > Run.
--  (Já existe o schema.sql principal; este arquivo só acrescenta as lives.)
-- ============================================================================

create table if not exists lives (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table lives enable row level security;

-- Leitura pública (qualquer visitante vê os jogos no site).
create policy "ler lives" on lives for select using (true);

-- Só o admin (logado via Supabase Auth) pode adicionar/editar/remover.
create policy "admin lives" on lives
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Depois de rodar isto: entre no painel do site como admin e, nas Configurações,
-- clique em "Enviar dados ao Supabase" uma vez para enviar os jogos já cadastrados.
