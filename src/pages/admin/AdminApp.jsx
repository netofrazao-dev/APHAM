import { Routes, Route } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import ProductsAdmin from './ProductsAdmin'
import CategoriesAdmin from './CategoriesAdmin'
import OrdersAdmin from './OrdersAdmin'
import NewsAdmin from './NewsAdmin'
import LivesAdmin from './LivesAdmin'
import CalendarAdmin from './CalendarAdmin'
import EquipesAdmin from './EquipesAdmin'
import SettingsAdmin from './SettingsAdmin'
import CouponsAdmin from './CouponsAdmin'
import MessagesAdmin from './MessagesAdmin'
import LojasAdmin from './LojasAdmin'

export default function AdminApp() {
  const { isAdmin } = useStore()
  if (!isAdmin) return <AdminLogin />
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<ProductsAdmin />} />
        <Route path="lojas" element={<LojasAdmin />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
        <Route path="cupons" element={<CouponsAdmin />} />
        <Route path="pedidos" element={<OrdersAdmin />} />
        <Route path="mensagens" element={<MessagesAdmin />} />
        <Route path="novidades" element={<NewsAdmin />} />
        <Route path="lives" element={<LivesAdmin />} />
        <Route path="calendario" element={<CalendarAdmin />} />
        <Route path="equipes" element={<EquipesAdmin />} />
        <Route path="config" element={<SettingsAdmin />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
