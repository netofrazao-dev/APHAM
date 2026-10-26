import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  produtosSeed,
  categoriasSeed,
  settingsSeed,
  storiesSeed,
  novidadesSeed,
  livesSeed,
  cuponsSeed,
} from './seed'
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'
import * as sb from './sync'
import { limparNovidade, limparSettings } from './limpeza'
import { comissaoPct, slugLoja } from './lojas'

// ============================================================================
//  CONTEXTO DA LOJA
//  Guarda produtos, categorias, cupons, novidades, pedidos, mensagens, etc.
//  - Sem Supabase: tudo no navegador (localStorage).
//  - Com Supabase (variáveis de ambiente configuradas): o banco é a fonte da
//    verdade — lê do banco ao abrir e grava no banco a cada alteração; o
//    localStorage continua como cache/reserva.
//  Login: Supabase Auth (e-mail+senha). Quem está na lista de admins do banco
//  é admin; quem tem uma loja parceira é lojista (ver supabase/lojas-parceiras.sql).
// ============================================================================

const PREFIX = 'apham:'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* modo privado / cheio */
  }
}
function usePersistent(key, seed) {
  const [state, setState] = useState(() => load(key, seed))
  useEffect(() => {
    save(key, state)
  }, [key, state])
  return [state, setState]
}

// Migração de seed: ao atualizar o conteúdo base do código (novidades, stories,
// lives), limpamos o cache antigo dessas coleções no navegador para o site
// voltar a mostrar o conteúdo novo. O banco (Supabase), quando tem dados,
// continua com prioridade na hidratação. Roda uma vez por navegador.
const SEED_VERSION = '2026-10-26a'
try {
  if (localStorage.getItem(PREFIX + 'seedVersion') !== SEED_VERSION) {
    ;['novidades', 'stories', 'lives'].forEach((k) => localStorage.removeItem(PREFIX + k))
    localStorage.setItem(PREFIX + 'seedVersion', SEED_VERSION)
  }
} catch {
  /* ignora (modo privado / indisponível) */
}

function upsert(list, item) {
  const i = list.findIndex((x) => x.id === item.id)
  if (i >= 0) {
    const n = [...list]
    n[i] = item
    return n
  }
  return [...list, item]
}

export function slugify(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function novoId(prefixo = 'id') {
  return `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const StoreCtx = createContext(null)
export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return ctx
}

export function StoreProvider({ children }) {
  const [produtos, setProdutos] = usePersistent('produtos', produtosSeed)
  const [categorias, setCategorias] = usePersistent('categorias', categoriasSeed)
  const [settings, setSettings] = usePersistent('settings', settingsSeed)
  const [novidades, setNovidades] = usePersistent('novidades', novidadesSeed)
  const [stories, setStories] = usePersistent('stories', storiesSeed)
  const [lives, setLives] = usePersistent('lives', livesSeed)
  const [orders, setOrders] = usePersistent('orders', [])
  const [cart, setCart] = usePersistent('cart', [])
  const [cupons, setCupons] = usePersistent('cupons', cuponsSeed)
  const [favoritos, setFavoritos] = usePersistent('favoritos', [])
  const [mensagens, setMensagens] = usePersistent('mensagens', [])
  const [recentes, setRecentes] = usePersistent('recentes', [])
  // Lojas parceiras (marketplace) e repasses da APHAM para os lojistas.
  const [lojas, setLojas] = usePersistent('lojas', [])
  const [repasses, setRepasses] = usePersistent('repasses', [])
  const [usuario, setUsuario] = useState(null) // { id, email, meta } de quem está logado
  // Sem Supabase (testes locais) as lojas funcionam no navegador; com Supabase,
  // só depois de rodar o script supabase/lojas-parceiras.sql.
  const [marketplaceOk, setMarketplaceOk] = useState(!isSupabaseEnabled)
  const [pedidosLoja, setPedidosLoja] = useState([]) // pedidos que o lojista logado pode ver
  const [lojistaLocalId, setLojistaLocalId] = useState(() => {
    try {
      return sessionStorage.getItem(PREFIX + 'lojista') || null
    } catch {
      return null
    }
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    if (isSupabaseEnabled) return false
    try {
      return sessionStorage.getItem(PREFIX + 'admin') === '1'
    } catch {
      return false
    }
  })

  // ----- Supabase: hidrata o conteúdo público ao abrir -----
  useEffect(() => {
    if (!isSupabaseEnabled) return
    let alive = true
    ;(async () => {
      const lj = await sb.sbSelectLojas()
      if (!alive) return
      setMarketplaceOk(!!lj)
      if (lj) setLojas(lj)
      const prod = await sb.sbSelectProdutos()
      if (!alive || !prod || prod.length === 0) return // banco ainda vazio: mantém o seed
      setProdutos(prod)
      const [cat, cup, nov, sto, liv, setg] = await Promise.all([
        sb.sbSelect('categorias'),
        sb.sbSelect('cupons'),
        sb.sbSelect('novidades', 'created_at'),
        sb.sbSelect('stories'),
        sb.sbSelect('lives'),
        sb.sbSelectSettings(),
      ])
      if (!alive) return
      if (cat && cat.length) setCategorias(cat)
      if (cup) setCupons(cup)
      // Só troca pelo banco se houver conteúdo lá (senão mantém o seed do site).
      if (nov && nov.length) setNovidades(nov.map(limparNovidade))
      if (sto && sto.length) setStories(sto)
      if (liv && liv.length) setLives(liv)
      if (setg) setSettings((s) => limparSettings({ ...s, ...setg }))
    })()
    return () => {
      alive = false
    }
  }, [setProdutos, setCategorias, setCupons, setNovidades, setStories, setLives, setSettings])

  // ----- Supabase: sessão (admin ou lojista) -----
  useEffect(() => {
    if (!isSupabaseEnabled) return
    let alive = true
    const aplicar = async (session) => {
      const u = session?.user || null
      setUsuario(u ? { id: u.id, email: u.email, meta: u.user_metadata || {} } : null)
      if (!u) {
        setIsAdmin(false)
        return
      }
      const r = await sb.sbIsAdmin()
      if (!alive) return
      // null = script das lojas ainda não rodado: vale a regra antiga (login = admin).
      setIsAdmin(r === null ? true : r)
    }
    supabase.auth.getSession().then(({ data }) => aplicar(data.session))
    // setTimeout: não chamar o Supabase de dentro do próprio aviso de login.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setTimeout(() => aplicar(session), 0))
    return () => {
      alive = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // ----- Supabase: ao logar, traz as lojas que a pessoa pode ver, repasses e,
  // para o lojista, os pedidos com produtos dele. Cria a loja pedida no cadastro
  // quando o e-mail precisou ser confirmado antes. -----
  useEffect(() => {
    if (!isSupabaseEnabled || !usuario) return
    let alive = true
    ;(async () => {
      let lj = await sb.sbSelectLojas()
      if (!alive || !lj) return
      let minha = lj.find((l) => l.dono === usuario.id)
      if (!minha && usuario.meta?.lojaPendente) {
        try {
          minha = await sb.sbInsertLoja(usuario.id, usuario.meta.lojaPendente)
          lj = [...lj, minha]
        } catch {
          /* ignora: fica sem loja */
        }
      }
      setLojas(lj)
      const rep = await sb.sbSelectRepasses()
      if (alive && rep) setRepasses(rep)
      if (minha) {
        const ped = await sb.sbSelect('pedidos')
        if (alive && ped) setPedidosLoja(ped)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id])

  // ----- Supabase: ao logar como admin, traz pedidos/mensagens e migra se vazio -----
  useEffect(() => {
    if (!isSupabaseEnabled || !isAdmin) return
    let alive = true
    ;(async () => {
      const [ped, msg, prod] = await Promise.all([
        sb.sbSelect('pedidos'),
        sb.sbSelect('mensagens'),
        sb.sbSelectProdutos(),
      ])
      if (!alive) return
      if (ped) setOrders(ped)
      if (msg) setMensagens(msg)
      if (!prod || prod.length === 0) {
        // Primeira vez: envia os dados atuais para o banco.
        await sb.sbSeedAll({ produtos, categorias, cupons, novidades, stories, settings })
        return
      }
      // Corrige no banco os avisos de "conteúdo provisório" que ficaram salvos lá.
      const [nov, setg] = await Promise.all([sb.sbSelect('novidades', 'created_at'), sb.sbSelectSettings()])
      if (!alive) return
      for (const n of nov || []) {
        const limpa = limparNovidade(n)
        if (limpa !== n) await sb.sbUpsert('novidades', limpa)
      }
      const setgLimpo = limparSettings(setg)
      if (setg && setgLimpo !== setg) await sb.sbUpsertSettings(setgLimpo)
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  // ----- Carrinho (sempre local) -----
  const cartKey = (x) => `${x.id}|${x.tamanho || ''}|${x.cor || ''}`
  const addToCart = useCallback(
    (item) =>
      setCart((c) => {
        const i = c.findIndex((x) => cartKey(x) === cartKey(item))
        if (i >= 0) {
          const n = [...c]
          n[i] = { ...n[i], qtd: n[i].qtd + item.qtd }
          return n
        }
        return [...c, item]
      }),
    [setCart]
  )
  const updateQtd = useCallback(
    (idx, qtd) => setCart((c) => c.map((x, i) => (i === idx ? { ...x, qtd: Math.max(1, qtd) } : x))),
    [setCart]
  )
  const removeFromCart = useCallback((idx) => setCart((c) => c.filter((_, i) => i !== idx)), [setCart])
  const clearCart = useCallback(() => setCart([]), [setCart])

  // ----- Produtos -----
  const saveProduto = useCallback(
    (produto) => {
      const { lojaNome, ...p } = produto // lojaNome é só para a vitrine
      setProdutos((l) => upsert(l, p))
      // loja_id só vai junto em produto de loja parceira (o banco usa para as permissões).
      return sb.sbUpsert('produtos', p, p.lojaId ? { loja_id: p.lojaId } : {})
    },
    [setProdutos]
  )
  const deleteProduto = useCallback(
    (id) => {
      setProdutos((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('produtos', id)
    },
    [setProdutos]
  )

  // ----- Categorias -----
  const saveCategoria = useCallback(
    (c) => {
      setCategorias((l) => upsert(l, c))
      sb.sbUpsert('categorias', c)
    },
    [setCategorias]
  )
  const deleteCategoria = useCallback(
    (id) => {
      setCategorias((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('categorias', id)
    },
    [setCategorias]
  )

  // ----- Cupons -----
  const saveCupom = useCallback(
    (c) => {
      setCupons((l) => upsert(l, c))
      sb.sbUpsert('cupons', c)
    },
    [setCupons]
  )
  const deleteCupom = useCallback(
    (id) => {
      setCupons((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('cupons', id)
    },
    [setCupons]
  )
  const aplicarCupom = useCallback(
    (codigo, subtotal) => {
      const c = cupons.find(
        (x) => x.ativo && (x.codigo || '').toLowerCase() === (codigo || '').trim().toLowerCase()
      )
      if (!c) return { ok: false, motivo: 'Cupom inválido ou inativo.', desconto: 0 }
      if (subtotal < (Number(c.minimo) || 0))
        return { ok: false, motivo: 'Pedido mínimo não atingido para este cupom.', desconto: 0 }
      const desconto =
        c.tipo === 'percent' ? (subtotal * Number(c.valor)) / 100 : Math.min(Number(c.valor), subtotal)
      return { ok: true, desconto, cupom: c }
    },
    [cupons]
  )

  // ----- Favoritos / recentes (sempre local) -----
  const toggleFavorito = useCallback(
    (id) => setFavoritos((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])),
    [setFavoritos]
  )
  const isFavorito = useCallback((id) => favoritos.includes(id), [favoritos])
  const addRecente = useCallback(
    (id) => setRecentes((l) => [id, ...l.filter((x) => x !== id)].slice(0, 8)),
    [setRecentes]
  )

  // ----- Novidades / Stories -----
  const saveNovidade = useCallback(
    (n) => {
      setNovidades((l) => upsert(l, n))
      sb.sbUpsert('novidades', n)
    },
    [setNovidades]
  )
  const deleteNovidade = useCallback(
    (id) => {
      setNovidades((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('novidades', id)
    },
    [setNovidades]
  )
  // Reordena as novidades (mover um card para cima/baixo). dir: -1 sobe, +1 desce.
  // Reatribui `ordem` por posição e salva os itens no banco.
  const moveNovidade = useCallback(
    (id, dir) => {
      const ordenadas = [...novidades].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
      const idx = ordenadas.findIndex((x) => x.id === id)
      const j = idx + dir
      if (idx < 0 || j < 0 || j >= ordenadas.length) return
      ;[ordenadas[idx], ordenadas[j]] = [ordenadas[j], ordenadas[idx]]
      const next = ordenadas.map((item, pos) => ({ ...item, ordem: pos }))
      setNovidades(next)
      next.forEach((item) => sb.sbUpsert('novidades', item))
    },
    [novidades, setNovidades]
  )
  // Liga/desliga a sombra de TODOS os cards de novidades de uma vez.
  const setSombraTodos = useCallback(
    (valor) => {
      const next = novidades.map((n) => ({ ...n, sombra: valor }))
      setNovidades(next)
      next.forEach((n) => sb.sbUpsert('novidades', n))
    },
    [novidades, setNovidades]
  )
  const saveStory = useCallback(
    (s) => {
      setStories((l) => upsert(l, s))
      sb.sbUpsert('stories', s)
    },
    [setStories]
  )
  const deleteStory = useCallback(
    (id) => {
      setStories((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('stories', id)
    },
    [setStories]
  )

  // ----- Lives APHAM (jogos transmitidos) -----
  const saveLive = useCallback(
    (j) => {
      setLives((l) => upsert(l, j))
      sb.sbUpsert('lives', j)
    },
    [setLives]
  )
  const deleteLive = useCallback(
    (id) => {
      setLives((l) => l.filter((x) => x.id !== id))
      sb.sbDelete('lives', id)
    },
    [setLives]
  )

  // ----- Pedidos -----
  const addOrder = useCallback(
    (o) => {
      setOrders((l) => [o, ...l])
      // Lojas parceiras com produtos no pedido (para cada lojista ver os seus).
      const ids = [...new Set((o.itens || []).map((i) => i.lojaId).filter(Boolean))]
      sb.sbUpsert('pedidos', o, { numero: o.numero, status: o.status, ...(ids.length ? { lojas: ids } : {}) })
    },
    [setOrders]
  )
  const updateOrder = useCallback(
    (id, patch) =>
      setOrders((l) =>
        l.map((o) => {
          if (o.id !== id) return o
          const n = { ...o, ...patch }
          sb.sbUpsert('pedidos', n, { numero: n.numero, status: n.status })
          return n
        })
      ),
    [setOrders]
  )
  const deleteOrder = useCallback(
    (id) => {
      setOrders((l) => l.filter((o) => o.id !== id))
      sb.sbDelete('pedidos', id)
    },
    [setOrders]
  )

  // ----- Mensagens -----
  const addMensagem = useCallback(
    (m) => {
      const full = { ...m, id: novoId('msg'), data: new Date().toISOString(), lida: false }
      setMensagens((l) => [full, ...l])
      sb.sbUpsert('mensagens', full, { lida: false })
    },
    [setMensagens]
  )
  const markMensagem = useCallback(
    (id, lida) =>
      setMensagens((l) =>
        l.map((m) => {
          if (m.id !== id) return m
          const n = { ...m, lida }
          sb.sbUpsert('mensagens', n, { lida })
          return n
        })
      ),
    [setMensagens]
  )
  const deleteMensagem = useCallback(
    (id) => {
      setMensagens((l) => l.filter((m) => m.id !== id))
      sb.sbDelete('mensagens', id)
    },
    [setMensagens]
  )

  // ----- Estoque -----
  const baixarEstoque = useCallback(
    (itens) =>
      setProdutos((list) =>
        list.map((p) => {
          const comprado = itens.filter((i) => i.id === p.id).reduce((s, i) => s + i.qtd, 0)
          if (!comprado) return p
          const np = { ...p, estoque: Math.max(0, Number(p.estoque) - comprado) }
          sb.sbUpsert('produtos', np)
          return np
        })
      ),
    [setProdutos]
  )

  // ----- Configurações -----
  const updateSettings = useCallback(
    (patch) =>
      setSettings((s) => {
        const n = { ...s, ...patch }
        // Garante que a antiga senha local não fica mais salva (segurança).
        delete n.senhaAdmin
        sb.sbUpsertSettings(n)
        return n
      }),
    [setSettings]
  )

  // ----- Admin -----
  // Login do painel é sempre pelo Supabase Auth (e-mail + senha do usuário).
  // Não há mais senha local no site (ela ficava legível e baixava a segurança).
  const login = useCallback(async (email, password) => {
    if (!isSupabaseEnabled) return false
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return !error
    } catch {
      return false
    }
  }, [])
  const logout = useCallback(async () => {
    if (isSupabaseEnabled) {
      try {
        await supabase.auth.signOut()
      } catch {
        /* ignore */
      }
      return
    }
    setIsAdmin(false)
    try {
      sessionStorage.removeItem(PREFIX + 'admin')
    } catch {
      /* ignore */
    }
  }, [])

  // ----- Lojas parceiras -----
  const pct = comissaoPct(settings)
  const lojasPorId = useMemo(() => Object.fromEntries(lojas.map((l) => [l.id, l])), [lojas])
  const lojasAprovadas = useMemo(() => lojas.filter((l) => l.status === 'aprovada'), [lojas])
  const minhaLoja = useMemo(() => {
    if (isSupabaseEnabled) return (usuario && lojas.find((l) => l.dono === usuario.id)) || null
    return lojas.find((l) => l.id === lojistaLocalId) || null
  }, [lojas, usuario, lojistaLocalId])
  // Produtos à venda: ativos e, se de loja parceira, só de loja aprovada.
  const produtosVitrine = useMemo(
    () =>
      produtos
        .filter((p) => p.ativo !== false && (!p.lojaId || lojasPorId[p.lojaId]?.status === 'aprovada'))
        .map((p) => (p.lojaId ? { ...p, lojaNome: lojasPorId[p.lojaId]?.nome || '' } : p)),
    [produtos, lojasPorId]
  )
  // Pedidos que o lojista logado enxerga (no navegador, filtra os pedidos locais).
  const pedidosDaMinhaLoja = useMemo(() => {
    if (!minhaLoja) return []
    const base = isSupabaseEnabled ? pedidosLoja : orders
    return base.filter((o) => (o.itens || []).some((i) => i.lojaId === minhaLoja.id))
  }, [minhaLoja, pedidosLoja, orders])

  const dadosLoja = ({ id, dono, status, criadaEm, ...resto }) => resto

  // Pedido de cadastro de um lojista (cria o login e a loja "em análise").
  const solicitarLoja = useCallback(
    async ({ dados, email, senha }) => {
      const loja = { ...dados, email, slug: slugLoja(dados.nome) }
      if (!isSupabaseEnabled) {
        const nova = { ...loja, id: novoId('loja'), dono: 'local', status: 'pendente', criadaEm: new Date().toISOString() }
        setLojas((l) => [...l, nova])
        setLojistaLocalId(nova.id)
        try {
          sessionStorage.setItem(PREFIX + 'lojista', nova.id)
        } catch {
          /* ignora */
        }
        return { ok: true, confirmarEmail: false }
      }
      if (!marketplaceOk) return { ok: false, erro: 'O cadastro de lojas ainda não está disponível.' }
      const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { lojaPendente: loja } } })
      if (error) {
        const msg = /registered|already/i.test(error.message) ? 'Este e-mail já tem cadastro. Entre pela área do lojista.' : 'Não foi possível criar o cadastro. Confira os dados e tente de novo.'
        return { ok: false, erro: msg }
      }
      if (data.session && data.user) {
        try {
          const nova = await sb.sbInsertLoja(data.user.id, loja)
          setLojas((l) => [...l.filter((x) => x.id !== nova.id), nova])
        } catch {
          /* a loja é criada no próximo login (ver efeito acima) */
        }
        return { ok: true, confirmarEmail: false }
      }
      return { ok: true, confirmarEmail: true }
    },
    [marketplaceOk, setLojas]
  )

  // Login do lojista (no navegador, sem Supabase, entra pelo e-mail da loja).
  const entrarLojista = useCallback(
    async (email, senha) => {
      if (isSupabaseEnabled) return login(email, senha)
      const l = lojas.find((x) => (x.email || '').toLowerCase() === (email || '').trim().toLowerCase())
      if (!l) return false
      setLojistaLocalId(l.id)
      try {
        sessionStorage.setItem(PREFIX + 'lojista', l.id)
      } catch {
        /* ignora */
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lojas]
  )
  const sairLojista = useCallback(async () => {
    if (isSupabaseEnabled) {
      try {
        await supabase.auth.signOut()
      } catch {
        /* ignora */
      }
      return
    }
    setLojistaLocalId(null)
    try {
      sessionStorage.removeItem(PREFIX + 'lojista')
    } catch {
      /* ignora */
    }
  }, [])

  const atualizarLojaLocal = (nova) => setLojas((l) => l.map((x) => (x.id === nova.id ? nova : x)))

  // O lojista edita os dados da própria loja.
  const salvarMinhaLoja = useCallback(
    async (patch) => {
      if (!minhaLoja) return false
      const nova = { ...minhaLoja, ...patch }
      if (!isSupabaseEnabled) {
        atualizarLojaLocal(nova)
        return true
      }
      try {
        atualizarLojaLocal(await sb.sbUpdateLoja(minhaLoja.id, { data: dadosLoja(nova) }))
        return true
      } catch {
        return false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minhaLoja]
  )

  // Admin: aprovar, recusar, suspender ou reativar uma loja.
  const definirStatusLoja = useCallback(
    async (id, status) => {
      const atual = lojas.find((l) => l.id === id)
      if (!atual) return false
      // Na aprovação garante um endereço único para a página da loja.
      let slug = atual.slug || slugLoja(atual.nome)
      if (lojas.some((l) => l.id !== id && l.slug === slug)) slug = `${slug}-${String(id).slice(-4)}`
      const nova = { ...atual, status, slug }
      if (!isSupabaseEnabled) {
        atualizarLojaLocal(nova)
        return true
      }
      try {
        atualizarLojaLocal(await sb.sbUpdateLoja(id, { status, data: dadosLoja(nova) }))
        return true
      } catch {
        return false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lojas]
  )

  // Admin: registra um pagamento feito a um lojista.
  const registrarRepasse = useCallback(
    async (r) => {
      if (!isSupabaseEnabled) {
        setRepasses((l) => [{ ...r, id: novoId('rep'), criadoEm: new Date().toISOString() }, ...l])
        return true
      }
      try {
        const novo = await sb.sbInsertRepasse(r)
        setRepasses((l) => [novo, ...l])
        return true
      } catch {
        return false
      }
    },
    [setRepasses]
  )

  // Migração manual para o Supabase (botão nas configurações).
  const migrarParaSupabase = useCallback(
    () => sb.sbSeedAll({ produtos, categorias, cupons, novidades, stories, lives, settings }),
    [produtos, categorias, cupons, novidades, stories, lives, settings]
  )

  // ----- Export / Import / Reset -----
  const exportData = useCallback(
    () => ({ versao: 2, produtos, categorias, settings, novidades, stories, lives, orders, cupons, mensagens }),
    [produtos, categorias, settings, novidades, stories, lives, orders, cupons, mensagens]
  )
  const importData = useCallback(
    (data) => {
      if (!data || typeof data !== 'object') return false
      if (data.produtos) setProdutos(data.produtos)
      if (data.categorias) setCategorias(data.categorias)
      if (data.settings) setSettings(data.settings)
      if (data.novidades) setNovidades(data.novidades)
      if (data.stories) setStories(data.stories)
      if (data.lives) setLives(data.lives)
      if (data.orders) setOrders(data.orders)
      if (data.cupons) setCupons(data.cupons)
      if (data.mensagens) setMensagens(data.mensagens)
      return true
    },
    [setProdutos, setCategorias, setSettings, setNovidades, setStories, setLives, setOrders, setCupons, setMensagens]
  )
  const resetData = useCallback(() => {
    setProdutos(produtosSeed)
    setCategorias(categoriasSeed)
    setSettings(settingsSeed)
    setNovidades(novidadesSeed)
    setStories(storiesSeed)
    setLives(livesSeed)
    setOrders([])
    setCupons(cuponsSeed)
    setMensagens([])
    setFavoritos([])
    setRecentes([])
    setCart([])
  }, [setProdutos, setCategorias, setSettings, setNovidades, setStories, setLives, setOrders, setCupons, setMensagens, setFavoritos, setRecentes, setCart])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qtd, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.preco * i.qtd, 0), [cart])

  const value = {
    produtos,
    categorias,
    settings,
    novidades,
    stories,
    lives,
    orders,
    cart,
    cupons,
    favoritos,
    mensagens,
    recentes,
    cartCount,
    cartTotal,
    isAdmin,
    supabaseAtivo: isSupabaseEnabled,
    // Lojas parceiras
    comissao: pct,
    lojas,
    lojasAprovadas,
    lojasPorId,
    minhaLoja,
    usuario,
    marketplaceOk,
    produtosVitrine,
    pedidosDaMinhaLoja,
    repasses,
    solicitarLoja,
    entrarLojista,
    sairLojista,
    salvarMinhaLoja,
    definirStatusLoja,
    registrarRepasse,
    addToCart,
    updateQtd,
    removeFromCart,
    clearCart,
    saveProduto,
    deleteProduto,
    saveCategoria,
    deleteCategoria,
    saveNovidade,
    deleteNovidade,
    moveNovidade,
    setSombraTodos,
    saveStory,
    deleteStory,
    saveLive,
    deleteLive,
    addOrder,
    updateOrder,
    deleteOrder,
    updateSettings,
    saveCupom,
    deleteCupom,
    aplicarCupom,
    toggleFavorito,
    isFavorito,
    addMensagem,
    markMensagem,
    deleteMensagem,
    addRecente,
    baixarEstoque,
    login,
    logout,
    migrarParaSupabase,
    exportData,
    importData,
    resetData,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
