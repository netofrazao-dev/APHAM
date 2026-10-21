-- ============================================================================
--  BANCO DE DADOS DA APHAM (Supabase / PostgreSQL)
--  Cole e rode tudo isto no Supabase: projeto > SQL Editor > New query > Run.
--  Cada tabela guarda o objeto completo em `data` (jsonb), espelhando o que
--  o site já usa hoje no navegador — assim a migração dos dados é direta.
-- ============================================================================

-- Produtos ------------------------------------------------------------------
create table if not exists produtos (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Categorias ----------------------------------------------------------------
create table if not exists categorias (
  id text primary key,
  data jsonb not null
);

-- Cupons --------------------------------------------------------------------
create table if not exists cupons (
  id text primary key,
  data jsonb not null
);

-- Novidades (posts) ---------------------------------------------------------
create table if not exists novidades (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Stories -------------------------------------------------------------------
create table if not exists stories (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Lives APHAM (jogos transmitidos no YouTube) -------------------------------
create table if not exists lives (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Pedidos -------------------------------------------------------------------
create table if not exists pedidos (
  id text primary key,
  numero text,
  status text not null default 'recebido',
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Mensagens de contato ------------------------------------------------------
create table if not exists mensagens (
  id text primary key,
  lida boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Configurações (linha única) ----------------------------------------------
create table if not exists settings (
  id int primary key default 1,
  data jsonb not null,
  constraint settings_single_row check (id = 1)
);

-- ============================================================================
--  SEGURANÇA (Row Level Security)
--  - Qualquer visitante pode LER produtos, categorias, novidades, stories,
--    configurações (vitrine pública).
--  - Qualquer visitante pode CRIAR pedidos e mensagens (checkout / contato).
--  - Só quem está logado (admin, via Supabase Auth) pode alterar o resto.
-- ============================================================================
alter table produtos   enable row level security;
alter table categorias enable row level security;
alter table cupons     enable row level security;
alter table novidades  enable row level security;
alter table stories    enable row level security;
alter table lives      enable row level security;
alter table pedidos    enable row level security;
alter table mensagens  enable row level security;
alter table settings   enable row level security;

-- Leitura pública
create policy "ler produtos"   on produtos   for select using (true);
create policy "ler categorias" on categorias for select using (true);
create policy "ler novidades"  on novidades  for select using (true);
create policy "ler stories"    on stories    for select using (true);
create policy "ler settings"   on settings   for select using (true);
create policy "ler cupons"     on cupons     for select using (true);
create policy "ler lives"      on lives      for select using (true);

-- Visitante pode criar pedido e mensagem
create policy "criar pedido"   on pedidos   for insert with check (true);
create policy "criar mensagem" on mensagens for insert with check (true);

-- Admin (logado) faz tudo
create policy "admin produtos"   on produtos   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin categorias" on categorias for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin cupons"     on cupons     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin novidades"  on novidades  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin stories"    on stories    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin lives"      on lives      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin pedidos"    on pedidos    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin mensagens"  on mensagens  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin settings"   on settings   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Pronto. Depois disto, crie um usuário admin em Authentication > Users e me
-- envie a URL do projeto e a chave anon public (essas são públicas).
