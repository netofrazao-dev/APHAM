-- ============================================================================
--  LOJAS PARCEIRAS (marketplace) + CORREÇÃO DE SEGURANÇA
--  Rode UMA VEZ no Supabase: projeto > SQL Editor > New query > cole tudo > Run.
--  Pode rodar de novo sem problema (o script não duplica nada).
--
--  O que este script faz:
--  0. Cria as tabelas básicas que estiverem faltando (ex.: Lives).
--  1. Cria a lista de ADMINS. Antes, qualquer pessoa com login no Supabase podia
--     alterar tudo; agora só quem está nessa lista. Quem já tem login hoje
--     (a equipe da APHAM) entra automaticamente como admin.
--  2. Cria as LOJAS dos lojistas parceiros (pedido de cadastro → aprovação).
--  3. Deixa cada lojista mexer só nos produtos da própria loja.
--  4. Deixa o lojista ver os pedidos que têm produtos dele.
--  5. Cria o registro de REPASSES (o que a APHAM já pagou a cada lojista).
-- ============================================================================

-- 0) Tabelas básicas do site ---------------------------------------------------
-- Cria as que faltarem (bancos criados com versões antigas do schema.sql não
-- tinham, por exemplo, a tabela das Lives). As que já existem não mudam.
create table if not exists produtos   (id text primary key, data jsonb not null, updated_at timestamptz not null default now());
create table if not exists categorias (id text primary key, data jsonb not null);
create table if not exists cupons     (id text primary key, data jsonb not null);
create table if not exists novidades  (id text primary key, data jsonb not null, created_at timestamptz not null default now());
create table if not exists stories    (id text primary key, data jsonb not null, created_at timestamptz not null default now());
create table if not exists lives      (id text primary key, data jsonb not null, created_at timestamptz not null default now());
create table if not exists pedidos    (id text primary key, numero text, status text not null default 'recebido', data jsonb not null, created_at timestamptz not null default now());
create table if not exists mensagens  (id text primary key, lida boolean not null default false, data jsonb not null, created_at timestamptz not null default now());
create table if not exists settings   (id int primary key default 1, data jsonb not null, constraint settings_single_row check (id = 1));

alter table produtos   enable row level security;
alter table categorias enable row level security;
alter table cupons     enable row level security;
alter table novidades  enable row level security;
alter table stories    enable row level security;
alter table lives      enable row level security;
alter table pedidos    enable row level security;
alter table mensagens  enable row level security;
alter table settings   enable row level security;

-- Leitura pública e criação de pedido/mensagem pelos visitantes (recria igual).
drop policy if exists "ler produtos"   on produtos;   create policy "ler produtos"   on produtos   for select using (true);
drop policy if exists "ler categorias" on categorias; create policy "ler categorias" on categorias for select using (true);
drop policy if exists "ler cupons"     on cupons;     create policy "ler cupons"     on cupons     for select using (true);
drop policy if exists "ler novidades"  on novidades;  create policy "ler novidades"  on novidades  for select using (true);
drop policy if exists "ler stories"    on stories;    create policy "ler stories"    on stories    for select using (true);
drop policy if exists "ler lives"      on lives;      create policy "ler lives"      on lives      for select using (true);
drop policy if exists "ler settings"   on settings;   create policy "ler settings"   on settings   for select using (true);
drop policy if exists "criar pedido"   on pedidos;    create policy "criar pedido"   on pedidos    for insert with check (true);
drop policy if exists "criar mensagem" on mensagens;  create policy "criar mensagem" on mensagens  for insert with check (true);

-- 1) Admins -------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
-- Todo login que existe AGORA vira admin (até aqui só a APHAM tinha login).
insert into admins (user_id) select id from auth.users on conflict do nothing;

alter table admins enable row level security;
drop policy if exists "ver o proprio admin" on admins;
create policy "ver o proprio admin" on admins for select using (user_id = auth.uid());

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;
grant execute on function is_admin() to anon, authenticated;

-- Troca "qualquer um logado" por "admin de verdade" em todas as tabelas.
drop policy if exists "admin produtos"   on produtos;
drop policy if exists "admin categorias" on categorias;
drop policy if exists "admin cupons"     on cupons;
drop policy if exists "admin novidades"  on novidades;
drop policy if exists "admin stories"    on stories;
drop policy if exists "admin lives"      on lives;
drop policy if exists "admin pedidos"    on pedidos;
drop policy if exists "admin mensagens"  on mensagens;
drop policy if exists "admin settings"   on settings;
create policy "admin produtos"   on produtos   for all using (is_admin()) with check (is_admin());
create policy "admin categorias" on categorias for all using (is_admin()) with check (is_admin());
create policy "admin cupons"     on cupons     for all using (is_admin()) with check (is_admin());
create policy "admin novidades"  on novidades  for all using (is_admin()) with check (is_admin());
create policy "admin stories"    on stories    for all using (is_admin()) with check (is_admin());
create policy "admin lives"      on lives      for all using (is_admin()) with check (is_admin());
create policy "admin pedidos"    on pedidos    for all using (is_admin()) with check (is_admin());
create policy "admin mensagens"  on mensagens  for all using (is_admin()) with check (is_admin());
create policy "admin settings"   on settings   for all using (is_admin()) with check (is_admin());

-- 2) Lojas --------------------------------------------------------------------
create table if not exists lojas (
  id uuid primary key default gen_random_uuid(),
  dono uuid not null unique references auth.users on delete cascade,
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovada', 'recusada', 'suspensa')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table lojas enable row level security;
drop policy if exists "ver lojas"           on lojas;
drop policy if exists "pedir loja"          on lojas;
drop policy if exists "lojista edita a sua" on lojas;
drop policy if exists "admin lojas"         on lojas;
create policy "ver lojas" on lojas for select
  using (status = 'aprovada' or dono = auth.uid() or is_admin());
create policy "pedir loja" on lojas for insert
  with check (dono = auth.uid() and status = 'pendente');
create policy "lojista edita a sua" on lojas for update
  using (dono = auth.uid()) with check (dono = auth.uid());
create policy "admin lojas" on lojas for all using (is_admin()) with check (is_admin());

-- O lojista edita os dados da loja, mas só a APHAM muda o status (aprovar etc.).
create or replace function proteger_status_loja() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() and (new.status is distinct from old.status or new.dono is distinct from old.dono) then
    raise exception 'Somente a APHAM altera o status da loja.';
  end if;
  return new;
end $$;
drop trigger if exists proteger_status_loja on lojas;
create trigger proteger_status_loja before update on lojas
  for each row execute function proteger_status_loja();

-- 3) Produtos das lojas ---------------------------------------------------------
-- loja_id vazio = produto da própria APHAM.
alter table produtos add column if not exists loja_id uuid references lojas(id) on delete cascade;
drop policy if exists "lojista produtos" on produtos;
create policy "lojista produtos" on produtos for all
  using (loja_id in (select id from lojas where dono = auth.uid() and status = 'aprovada'))
  with check (loja_id in (select id from lojas where dono = auth.uid() and status = 'aprovada'));

-- 4) Pedidos: quais lojas têm produtos no pedido --------------------------------
alter table pedidos add column if not exists lojas uuid[] not null default '{}';
drop policy if exists "lojista ve seus pedidos" on pedidos;
create policy "lojista ve seus pedidos" on pedidos for select
  using (exists (select 1 from lojas l where l.dono = auth.uid() and l.id = any (pedidos.lojas)));

-- 5) Repasses (pagamentos da APHAM para os lojistas) ----------------------------
create table if not exists repasses (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references lojas(id) on delete cascade,
  valor numeric(10, 2) not null check (valor > 0),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table repasses enable row level security;
drop policy if exists "admin repasses"     on repasses;
drop policy if exists "lojista ve repasses" on repasses;
create policy "admin repasses" on repasses for all using (is_admin()) with check (is_admin());
create policy "lojista ve repasses" on repasses for select
  using (loja_id in (select id from lojas where dono = auth.uid()));

-- Pronto. Para adicionar outro admin no futuro:
--   insert into admins (user_id) select id from auth.users where email = 'email@exemplo.com';
