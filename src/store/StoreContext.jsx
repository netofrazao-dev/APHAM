import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  produtosSeed,
  categoriasSeed,
  settingsSeed,
  storiesSeed,
  novidadesSeed,
  cuponsSeed,
} from './seed'

// ============================================================================
//  CONTEXTO DA LOJA
//  Guarda produtos, categorias, configurações, novidades, pedidos e carrinho.
//  Persiste no navegador (localStorage). Preparado para, no futuro, trocar a
//  camada de dados por um banco (Supabase) sem mudar os componentes.
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
    /* modo privado / storage cheio — ignora */
  }
}

function usePersistent(key, seed) {
  const [state, setState] = useState(() => load(key, seed))
  useEffect(() => {
    save(key, state)
  }, [key, state])
  return [state, setState]
}

// Helper CRUD por id (merge por id; adiciona se não existir).
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
  const [orders, setOrders] = usePersistent('orders', [])
  const [cart, setCart] = usePersistent('cart', [])
  const [cupons, setCupons] = usePersistent('cupons', cuponsSeed)
  const [favoritos, setFavoritos] = usePersistent('favoritos', [])
  const [mensagens, setMensagens] = usePersistent('mensagens', [])
  const [recentes, setRecentes] = usePersistent('recentes', [])
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(PREFIX + 'admin') === '1'
    } catch {
      return false
    }
  })

  // ----- Carrinho -----
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
  const removeFromCart = useCallback(
    (idx) => setCart((c) => c.filter((_, i) => i !== idx)),
    [setCart]
  )
  const clearCart = useCallback(() => setCart([]), [setCart])

  // ----- Cupons -----
  const saveCupom = useCallback((c) => setCupons((l) => upsert(l, c)), [setCupons])
  const deleteCupom = useCallback((id) => setCupons((l) => l.filter((x) => x.id !== id)), [setCupons])
  const aplicarCupom = useCallback(
    (codigo, subtotal) => {
      const c = cupons.find(
        (x) => x.ativo && (x.codigo || '').toLowerCase() === (codigo || '').trim().toLowerCase()
      )
      if (!c) return { ok: false, motivo: 'Cupom inválido ou inativo.', desconto: 0 }
      if (subtotal < (Number(c.minimo) || 0))
        return { ok: false, motivo: 'Pedido mínimo não atingido para este cupom.', desconto: 0 }
      const desconto =
        c.tipo === 'percent'
          ? (subtotal * Number(c.valor)) / 100
          : Math.min(Number(c.valor), subtotal)
      return { ok: true, desconto, cupom: c }
    },
    [cupons]
  )

  // ----- Favoritos -----
  const toggleFavorito = useCallback(
    (id) => setFavoritos((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])),
    [setFavoritos]
  )
  const isFavorito = useCallback((id) => favoritos.includes(id), [favoritos])

  // ----- Mensagens de contato -----
  const addMensagem = useCallback(
    (m) =>
      setMensagens((l) => [
        { ...m, id: novoId('msg'), data: new Date().toISOString(), lida: false },
        ...l,
      ]),
    [setMensagens]
  )
  const markMensagem = useCallback(
    (id, lida) => setMensagens((l) => l.map((m) => (m.id === id ? { ...m, lida } : m))),
    [setMensagens]
  )
  const deleteMensagem = useCallback((id) => setMensagens((l) => l.filter((m) => m.id !== id)), [setMensagens])

  // ----- Vistos recentemente -----
  const addRecente = useCallback(
    (id) => setRecentes((l) => [id, ...l.filter((x) => x !== id)].slice(0, 8)),
    [setRecentes]
  )

  // ----- Estoque -----
  const baixarEstoque = useCallback(
    (itens) =>
      setProdutos((list) =>
        list.map((p) => {
          const comprado = itens
            .filter((i) => i.id === p.id)
            .reduce((s, i) => s + i.qtd, 0)
          return comprado ? { ...p, estoque: Math.max(0, Number(p.estoque) - comprado) } : p
        })
      ),
    [setProdutos]
  )

  // ----- Produtos -----
  const saveProduto = useCallback((p) => setProdutos((l) => upsert(l, p)), [setProdutos])
  const deleteProduto = useCallback((id) => setProdutos((l) => l.filter((x) => x.id !== id)), [setProdutos])

  // ----- Categorias -----
  const saveCategoria = useCallback((c) => setCategorias((l) => upsert(l, c)), [setCategorias])
  const deleteCategoria = useCallback((id) => setCategorias((l) => l.filter((x) => x.id !== id)), [setCategorias])

  // ----- Novidades / Stories -----
  const saveNovidade = useCallback((n) => setNovidades((l) => upsert(l, n)), [setNovidades])
  const deleteNovidade = useCallback((id) => setNovidades((l) => l.filter((x) => x.id !== id)), [setNovidades])
  const saveStory = useCallback((s) => setStories((l) => upsert(l, s)), [setStories])
  const deleteStory = useCallback((id) => setStories((l) => l.filter((x) => x.id !== id)), [setStories])

  // ----- Pedidos -----
  const addOrder = useCallback((o) => setOrders((l) => [o, ...l]), [setOrders])
  const updateOrder = useCallback(
    (id, patch) => setOrders((l) => l.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    [setOrders]
  )
  const deleteOrder = useCallback((id) => setOrders((l) => l.filter((o) => o.id !== id)), [setOrders])

  // ----- Configurações -----
  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), [setSettings])

  // ----- Admin -----
  const login = useCallback(
    (senha) => {
      if (senha && senha === settings.senhaAdmin) {
        setIsAdmin(true)
        try {
          sessionStorage.setItem(PREFIX + 'admin', '1')
        } catch {
          /* ignore */
        }
        return true
      }
      return false
    },
    [settings.senhaAdmin]
  )
  const logout = useCallback(() => {
    setIsAdmin(false)
    try {
      sessionStorage.removeItem(PREFIX + 'admin')
    } catch {
      /* ignore */
    }
  }, [])

  // ----- Export / Import / Reset -----
  const exportData = useCallback(
    () => ({ versao: 2, produtos, categorias, settings, novidades, stories, orders, cupons, mensagens }),
    [produtos, categorias, settings, novidades, stories, orders, cupons, mensagens]
  )
  const importData = useCallback(
    (data) => {
      if (!data || typeof data !== 'object') return false
      if (data.produtos) setProdutos(data.produtos)
      if (data.categorias) setCategorias(data.categorias)
      if (data.settings) setSettings(data.settings)
      if (data.novidades) setNovidades(data.novidades)
      if (data.stories) setStories(data.stories)
      if (data.orders) setOrders(data.orders)
      if (data.cupons) setCupons(data.cupons)
      if (data.mensagens) setMensagens(data.mensagens)
      return true
    },
    [setProdutos, setCategorias, setSettings, setNovidades, setStories, setOrders, setCupons, setMensagens]
  )
  const resetData = useCallback(() => {
    setProdutos(produtosSeed)
    setCategorias(categoriasSeed)
    setSettings(settingsSeed)
    setNovidades(novidadesSeed)
    setStories(storiesSeed)
    setOrders([])
    setCupons(cuponsSeed)
    setMensagens([])
    setFavoritos([])
    setRecentes([])
    setCart([])
  }, [setProdutos, setCategorias, setSettings, setNovidades, setStories, setOrders, setCupons, setMensagens, setFavoritos, setRecentes, setCart])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qtd, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.preco * i.qtd, 0), [cart])

  const value = {
    produtos,
    categorias,
    settings,
    novidades,
    stories,
    orders,
    cart,
    cupons,
    favoritos,
    mensagens,
    recentes,
    cartCount,
    cartTotal,
    isAdmin,
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
    exportData,
    importData,
    resetData,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
