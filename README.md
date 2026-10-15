# Site + Loja da APHAM

Site institucional e **loja oficial** da **APHAM — Associação de Praticantes de Handebol do Marajó**
(Breves/PA). Feito com **React + Vite + Tailwind + React Router**.

Cores da marca: **azul marinho** + **azul ciano** (da logo da APHAM).

---

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # versão final (pasta dist)
npm run preview  # pré-visualiza a versão final
```

---

## Páginas

- `/` — **site institucional** (início, associação, novidades, eventos, equipes, reconhecimentos, vídeos, galeria, apoie, contato).
- `/loja` — **loja** (catálogo, busca, filtros, ordenação).
- `/loja/produto/:id` — página do produto (variações, quantidade).
- `/carrinho` e `/checkout` — carrinho e finalização (cupom, frete, **PIX com QR** + WhatsApp).
- `/pedido` e `/pedido/:numero` — **acompanhar pedido** (etapas: recebido → confirmado → preparo → em rota → entregue).
- `/admin` — **painel administrativo**.

## Recursos da loja
Busca, filtros e ordenação · produtos com variações (tamanho/cor), estoque e promoção ·
**favoritos** · **recomendações** (relacionados, "complete seu pedido", vistos recentemente) ·
**cupons de desconto** · **frete** (retirada grátis / entrega) · **pagamento PIX direto no site**
(QR Code + copia-e-cola gerados do total, sem gateway) · **baixa de estoque** automática no pedido ·
**acompanhamento do pedido** por etapas · avisos (toasts).

---

## Painel administrativo (`/admin`)

Senha padrão: **`apham2009`** — **troque em Configurações** assim que possível.

O painel permite, **sem mexer em código**:
- **Produtos**: criar/editar/excluir, preço e preço promocional, estoque, tamanhos, cores,
  destaque, ativo/inativo e **upload de imagens** (otimizadas automaticamente).
- **Categorias**: criar/editar/excluir.
- **Cupons**: criar cupons de % ou valor fixo, com pedido mínimo, ativar/desativar.
- **Pedidos**: ver pedidos, abrir detalhes, avançar as etapas (recebido → confirmado → em
  preparo → em rota → entregue), falar com o cliente no WhatsApp e excluir.
- **Mensagens**: caixa de entrada dos contatos recebidos pelo site (ler/responder/excluir).
- **Novidades**: publicar **posts** e **stories** (com imagem) que aparecem na home.
- **Configurações**: dados da loja, WhatsApp, **PIX** (chave/nome/cidade), **frete**, senha, e
  **backup** (exportar/importar/restaurar).

### Importante sobre os dados (fase atual)
Hoje os dados (produtos, pedidos, novidades) ficam salvos **no navegador** (localStorage) de quem
usa o painel. Isso deixa tudo funcionando **sem depender de nenhuma conta ou serviço externo**.
Limitações que serão resolvidas na fase com **banco de dados (Supabase)**:
- Os dados não são compartilhados entre computadores/navegadores diferentes.
- A senha do painel é uma proteção simples (não é login seguro de verdade).

➡️ **Faça backup** de vez em quando em **Configurações → Exportar backup**. Quando ligarmos o
banco de dados, importamos esse arquivo e tudo migra.

---

## Checkout (como funciona hoje)
O cliente monta o carrinho e, no checkout, o pedido é **enviado pelo WhatsApp** da APHAM (com
todos os itens e dados), onde se combina pagamento e entrega. Se houver **chave PIX** cadastrada
em Configurações, ela também aparece para o cliente. Não exige nenhuma conta de pagamento.

---

## Publicar (Vercel + GitHub)
O projeto já tem `vercel.json` (rotas da SPA). Fluxo: subir o código no GitHub e importar no Vercel.
Depois apontar o domínio próprio (handebolmarajo.org) no painel do Vercel.

---

## ⏳ Pendências que dependem de você (combinado: fazer depois)
Estas precisam que você entre em algum serviço/crie conta — deixamos para a próxima fase:
1. **Instagram automático** nas Novidades (precisa de conta Instagram comercial + app no Meta).
2. **Banco de dados (Supabase)** + **login seguro** do admin + **keep-alive** automático (para não pausar em 7 dias).
3. **Envio de e-mails** nas interações/pedidos (ex.: Resend).
4. **Deploy no Vercel/GitHub** e **apontar o domínio** próprio.

## 📋 Conteúdo real que ainda falta
- Os **8 vídeos** exportados do Wix (colocar em `public/midia/videos/` — nomes no arquivo `src/data/content.js`).
- **Históricos reais** dos campeonatos/eventos; **novidades reais**; **fichas de atletas**; **números** reais dos contadores.
- **Fotos reais dos produtos** (adicionar pelo /admin).

---

## Onde editar (resumo)
- Conteúdo do site institucional: `src/data/content.js`.
- Produtos/novidades/configuração da loja: pelo **/admin** (ou dados iniciais em `src/store/seed.js`).
- Cores: `tailwind.config.js`.
- Otimizar imagens novas: `node scripts/optimize-images.mjs`.
