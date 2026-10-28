-- ============================================================================
--  PAINEL DE DOAÇÕES (Lei de Incentivo ao Esporte)
--  Rode UMA VEZ no Supabase: projeto > SQL Editor > New query > cole tudo > Run.
--  Pode rodar de novo sem problema (o script não duplica nada).
--  Precisa do supabase/lojas-parceiras.sql já rodado (usa a função is_admin()).
--
--  Privacidade: a tabela "doacoes" só é lida pelo admin. O site lê apenas a
--  função doacoes_publicas(), que esconde o nome das doações anônimas e o valor
--  de quem não quis mostrar (o valor ainda entra no total arrecadado).
-- ============================================================================

create table if not exists doacoes (id text primary key, data jsonb not null, created_at timestamptz not null default now());
alter table doacoes enable row level security;

-- Sem leitura pública da tabela: só o admin vê e altera.
drop policy if exists "admin doacoes" on doacoes;
create policy "admin doacoes" on doacoes for all using (is_admin()) with check (is_admin());

-- O que o site mostra: lista (mais recente primeiro) + total + quantidade + data da última atualização.
create or replace function doacoes_publicas() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'itens', coalesce(jsonb_agg(jsonb_build_object(
      'id', id,
      'nome', case when coalesce((data->>'anonimo')::boolean, false) then null else data->>'nome' end,
      'tipo', data->>'tipo',
      'data', data->>'data',
      'valor', case when coalesce((data->>'mostrarValor')::boolean, false) then nullif(data->>'valor', '')::numeric end
    ) order by data->>'data' desc, created_at desc), '[]'::jsonb),
    'total', coalesce(sum(nullif(data->>'valor', '')::numeric), 0),
    'quantidade', count(*),
    'atualizadoEm', max(data->>'atualizadoEm')
  )
  from doacoes
$$;
grant execute on function doacoes_publicas() to anon, authenticated;
