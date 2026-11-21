import { NavLink, Link, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Newspaper,
  Radio,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Ticket,
  Mail,
  Store,
  HandHeart,
  Info,
  UserPlus,
  Trophy,
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'

// Menu em grupos: primeiro as informações da APHAM (o que mais se edita),
// depois a loja. `grupo` abre um título no menu do computador.
const links = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { grupo: 'Informações da APHAM', to: '/admin/sobre', label: 'Quem somos', icon: Info },
  { to: '/admin/participar', label: 'Participar', icon: UserPlus },
  { to: '/admin/equipes', label: 'Clubes e equipes', icon: Users },
  { to: '/admin/eventos', label: 'Competições e eventos', icon: Trophy },
  { to: '/admin/calendario', label: 'Calendário', icon: CalendarDays },
  { to: '/admin/novidades', label: 'Novidades', icon: Newspaper },
  { to: '/admin/lives', label: 'Lives APHAM', icon: Radio },
  { to: '/admin/doacoes', label: 'Doações', icon: HandHeart },
  { to: '/admin/mensagens', label: 'Mensagens', icon: Mail },
  { grupo: 'Loja', to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/lojas', label: 'Lojas parceiras', icon: Store },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/cupons', label: 'Cupons', icon: Ticket },
  { grupo: 'Site', to: '/admin/config', label: 'Configurações', icon: Settings },
]

export default function AdminLayout() {
  const { logout, orders, mensagens } = useStore()
  const pendentes = orders.filter((o) => o.status === 'recebido').length
  const naoLidas = mensagens.filter((m) => !m.lida).length
  const badge = (to) => (to === '/admin/pedidos' ? pendentes : to === '/admin/mensagens' ? naoLidas : 0)

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-cyan-500 text-white' : 'text-navy-100/80 hover:bg-navy-800 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Sidebar */}
      <aside className="shrink-0 bg-navy-950 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5">
          {/* A logo leva de volta ao site (no celular é o único atalho). */}
          <Link to="/" title="Voltar para o site" aria-label="Voltar para o site" className="rounded-lg transition-opacity hover:opacity-80">
            <img src="/midia/logo-apham.png" alt="APHAM" className="h-10 w-auto" />
          </Link>
          <span className="font-display text-sm font-bold text-white">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {links.map((l) => [
            l.grupo && (
              <p key={`g-${l.grupo}`} className="hidden px-3.5 pb-1 pt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-100/40 lg:block">
                {l.grupo}
              </p>
            ),
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              <l.icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap">{l.label}</span>
              {badge(l.to) > 0 && (
                <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-bold text-white">
                  {badge(l.to)}
                </span>
              )}
            </NavLink>,
          ])}
        </nav>
        <div className="hidden gap-1 px-3 lg:flex lg:flex-col">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-100/70 transition-colors hover:bg-navy-800 hover:text-white">
            <ExternalLink className="h-5 w-5" />
            Ver site
          </Link>
          <button type="button" onClick={logout} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-100/70 transition-colors hover:bg-navy-800 hover:text-white">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
