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
