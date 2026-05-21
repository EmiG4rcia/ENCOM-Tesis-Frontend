import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../auth/useAuthContext'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/orders', label: 'Pedidos', icon: '📦' },
  { path: '/customers', label: 'Clientes', icon: '👥' },
  { path: '/menu', label: 'Menú', icon: '🍔' },
  { path: '/tables', label: 'Mesas', icon: '🪑' },
  { path: '/sales', label: 'Ventas', icon: '💰' },
]

export function Sidebar() {
  const { logout } = useAuthContext()

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">Jill's Sandwich</h1>
        <p className="text-xs text-gray-400 mt-0.5">Panel de Administración</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              transition-colors duration-200
              ${isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}