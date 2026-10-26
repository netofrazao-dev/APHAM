# Guia de deploy e integrações — APHAM

Passo a passo para colocar o site no ar (Vercel + GitHub) e ligar banco de dados
(Supabase), e-mail automático (Resend) e Instagram. Faça na ordem. Onde eu puder
ajudar/configurar o código, está indicado.

> 🔐 **Regra de ouro de segurança:** chaves **públicas** (Supabase URL e anon key)
> podem ser enviadas no chat. Chaves **secretas** (Resend, tokens, service_role)
> **nunca** vão no chat nem no código — só nas *Environment Variables* do Vercel.

---

## 1) GitHub + Vercel (colocar no ar)

1. Crie uma conta no **GitHub** (github.com) e no **Vercel** (vercel.com — entre com o GitHub).
2. Me avise: podemos subir o código de dois jeitos:
   - **Você loga no terminal** aqui (`gh auth login` e `vercel login`) e eu crio o
     repositório, faço o push e o deploy — sem ver suas senhas; **ou**
   - Você cria um repositório vazio no GitHub, me passa o endereço, eu faço o push, e
     você clica em **Import Project** no Vercel.
3. No Vercel, o build é automático (`npm run build`, saída `dist`). Já existe o
   `vercel.json` com as rotas e o cron do keep-alive.

Pronto: o site fica no ar num endereço `*.vercel.app`. (O domínio próprio fica para depois.)

---

## 1.1) Domínio próprio — www.handebolmarajo.org

O código já está pronto para o domínio (endereço oficial nas tags de compartilhamento,
`public/robots.txt` e `public/sitemap.xml`). Falta ligar o domínio no Vercel e no DNS:

1. No Vercel: **Project → Settings → Domains → Add** e adicione os dois:
   - `www.handebolmarajo.org` → domínio principal;
   - `handebolmarajo.org` → escolha **Redirect to www.handebolmarajo.org** (308).
2. O Vercel mostra os registros de DNS que faltam. No painel onde o domínio está
   registrado/gerenciado (Registro.br, Wix, GoDaddy, Hostinger…), crie **exatamente** os
   valores que o Vercel mostrar. Normalmente são:
   | Tipo | Nome | Valor |
   |---|---|---|
   | `A` | `@` (raiz) | `216.198.79.1` (o antigo `76.76.21.21` também funciona) |
   | `CNAME` | `www` | o valor que o Vercel mostrar no card do `www` (o antigo `cname.vercel-dns.com` também funciona) |

   Apague os registros `A`/`CNAME` antigos de `@` e `www` (ex.: os do Wix). **Não mexa**
   em registros `MX` (e-mail) nem `TXT` que já existirem.
3. A propagação leva de minutos a algumas horas. Quando o Vercel mostrar **Valid
   Configuration** nos dois, o HTTPS (cadeado) é emitido automaticamente.
4. Depois que o site estiver no ar, cadastre o domínio no **Google Search Console**
   (search.google.com/search-console) e envie o sitemap
   `https://www.handebolmarajo.org/sitemap.xml`.

> ⚠️ Enquanto o domínio apontar para o site antigo (Wix), mudar o DNS **tira o site
> antigo do ar** — faça a troca só quando o novo estiver aprovado.
> Se trocar de domínio no futuro, atualize `site.url` em `src/data/content.js`,
> `index.html`, `public/robots.txt` e `public/sitemap.xml`.

---

## 2) Supabase (banco de dados + login do admin)

1. Crie um projeto em **supabase.com**.
2. Em **SQL Editor → New query**, cole TODO o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
   e clique em **Run**. Isso cria as tabelas e as permissões.
3. Em **Authentication → Users → Add user**, crie o usuário admin (e-mail + senha). Esse
   será o login do painel `/admin` (no lugar da senha simples atual).
4. Em **Project Settings → API**, copie **Project URL** e **anon public key**
   (são públicas) e me envie aqui — ou coloque você mesmo no Vercel como:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (e também `SUPABASE_URL` e `SUPABASE_ANON_KEY`, iguais, para o keep-alive)
5. Com isso, **eu ligo o site ao banco** (migro os dados do painel e troco o login
   por autenticação de verdade) — e testamos juntos.

> O keep-alive já está pronto: o cron no `vercel.json` chama `/api/keep-alive` a cada
> 5 dias para o banco não pausar. Nenhum clique manual necessário.

---

## 2.1) Lojas parceiras + correção de segurança (rodar uma vez)

1. No Supabase, abra **SQL Editor → New query**, cole TODO o conteúdo de
   [`supabase/lojas-parceiras.sql`](supabase/lojas-parceiras.sql) e clique em **Run**.
2. Isso faz duas coisas:
   - **Segurança:** só quem está na lista de admins pode mexer no site pelo banco
     (antes, qualquer login podia). Quem já tem login hoje vira admin automaticamente.
   - **Lojas parceiras:** cria as tabelas de lojas e repasses e as permissões do lojista
     (ele só mexe na própria loja e nos próprios produtos).
3. Para adicionar outro admin depois:
   `insert into admins (user_id) select id from auth.users where email = 'email@exemplo.com';`

Como funciona: o lojista pede cadastro em **/vender**, a APHAM aprova em **/admin → Lojas
parceiras**, o lojista cuida da loja em **/lojista**. O produto aparece com o preço do lojista
+ a comissão da APHAM (% único, na mesma tela do painel). O cliente paga a APHAM; quando o
pedido é confirmado, o valor do lojista entra em "A repassar" e a APHAM registra cada repasse.

> Antes de rodar o script, o cadastro de lojas fica fechado ("abre em breve") e o resto do
> site funciona normalmente.

---

## 3) E-mail automático (Resend)

1. Crie conta em **resend.com** e gere uma **API Key**.
2. No Vercel (**Settings → Environment Variables**), adicione (secretas):
   - `RESEND_API_KEY` = sua chave
   - `NOTIFY_EMAIL` = apham.cvmf@gmail.com (para onde chegam os avisos)
   - `NOTIFY_FROM` = `APHAM <onboarding@resend.dev>` (troque por um remetente do seu
     domínio depois de verificá-lo no Resend)
3. Pronto: a cada **pedido** e **mensagem de contato**, o site chama `/api/notify` e a
   APHAM recebe um e-mail. (Já está ligado no código; sem a chave, ele só não envia.)

---

## 4) Instagram automático (novidades)

1. O Instagram da APHAM precisa ser **conta Comercial/Criador** vinculada a uma
   **Página do Facebook**.
2. Em **developers.facebook.com**, crie um app e gere um **token de acesso de longa
   duração** e o **ID da conta** do Instagram. (Eu te guio nesse passo, que é o mais
   burocrático.)
3. No Vercel, adicione (secretas): `INSTAGRAM_TOKEN` e `INSTAGRAM_USER_ID`.
4. A função `/api/instagram` já está pronta para buscar os posts; depois eu ligo a
   seção de Novidades para exibi-los automaticamente (com as novidades do painel como
   reserva).

---

## Resumo das variáveis de ambiente (no Vercel)

| Variável | Tipo | Onde conseguir |
|---|---|---|
| `VITE_SUPABASE_URL` | pública | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | pública | Supabase → Settings → API |
| `SUPABASE_URL` | pública | igual à de cima |
| `SUPABASE_ANON_KEY` | pública | igual à de cima |
| `RESEND_API_KEY` | **secreta** | Resend → API Keys |
| `NOTIFY_EMAIL` | config | e-mail da APHAM |
| `NOTIFY_FROM` | config | remetente |
| `INSTAGRAM_TOKEN` | **secreta** | Meta for Developers |
| `INSTAGRAM_USER_ID` | config | Meta for Developers |

Depois de configurar, basta um **redeploy** no Vercel para valer.
