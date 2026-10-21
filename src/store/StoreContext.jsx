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

// ============================================================================
//  CONTEXTO DA LOJA
//  Guarda produtos, categorias, cupons, novidades, pedidos, mensagens, etc.
//  - Sem Supabase: tudo no navegador (localStorage).
//  - Com Supabase (variáveis de ambiente configuradas): o banco é a fonte da
//    verdade — lê do banco ao abrir e grava no banco a cada alteração; o
//    localStorage continua como cache/reserva.
//  Login do admin: Supabase Auth (e-mail+senha) quando o banco está ligado;
//  senão, a senha simples das configurações.
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
      const prod = await sb.sbSelect('produtos')
      if (!alive || !prod || prod.length === 0) return // banco ainda vazio: mantém o seed
      setProdutos(prod)
      const [cat, cup, nov, sto, liv, setg] = await Promise.all([
        sb.sbSelect('categorias'),
        sb.sbSelect('cupons'),
        sb.sbSelect('novidades'),
        sb.sbSelect('stories'),
        sb.sbSelect('lives'),
        sb.sbSelectSettings(),
      ])
      if (!alive) return
      if (cat && cat.length) setCategorias(cat)
      if (cup) setCupons(cup)
      if (nov) setNovidades(nov)
      if (sto) setStories(sto)
      // Só troca pelas lives do banco se houver alguma lá (senão mantém o seed).
      if (liv && liv.length) setLives(liv)
      if (setg) setSettings((s) => ({ ...s, ...setg }))
    })()
    return () => {
      alive = false
    }
  }, [setProdutos, setCategorias, setCupons, setNovidades, setStories, setLives, setSettings])

  // ----- Supabase: sessão do admin -----
  useEffect(() => {
    if (!isSupabaseEnabled) return
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAdmin(!!session))
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  // ----- Supabase: ao logar como admin, traz pedidos/mensagens e migra se vazio -----
  useEffect(() => {
    if (!isSupabaseEnabled || !isAdmin) return
    let alive = true
    ;(async () => {
      const [ped, msg, prod] = await Promise.all([
        sb.sbSelect('pedidos'),
        sb.sbSelect('mensagens'),
        sb.sbSelect('produtos'),
      ])
      if (!alive) return
      if (ped) setOrders(ped)
      if (msg) setMensagens(msg)
      if (!prod || prod.length === 0) {
        // Primeira vez: envia os dados atuais para o banco.
        await sb.sbSeedAll({ produtos, categorias, cupons, novidades, stories, settings })
      }
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
    (p) => {
      setProdutos((l) => upsert(l, p))
      sb.sbUpsert('produtos', p)
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
      sb.sbUpsert('pedidos', o, { numero: o.numero, status: o.status })
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
