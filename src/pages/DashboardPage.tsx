import { useOrderSummary } from '../hooks/useOrders'
import { useCustomers } from '../hooks/useCustomers'
import { useMenu } from '../hooks/useMenu'
import { useTables } from '../hooks/useTables'
import { Navbar } from '../components/layout/Navbar'

interface SummaryCardProps {
  label: string
  value: number | string
  icon: string
  color: string
}

function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useOrderSummary()
  const { data: customers } = useCustomers()
  const { data: menu } = useMenu()
  const { data: tables } = useTables()

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Dashboard" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Pedidos hoy"
            value={loadingSummary ? '...' : (summary?.orders_today ?? 0)}
            icon="📦"
            color="bg-blue-50"
          />
          <SummaryCard
            label="Pedidos pendientes"
            value={loadingSummary ? '...' : (summary?.pending_orders ?? 0)}
            icon="⏳"
            color="bg-orange-50"
          />
          <SummaryCard
            label="Clientes registrados"
            value={customers?.length ?? '...'}
            icon="👥"
            color="bg-green-50"
          />
          <SummaryCard
            label="Items en menú"
            value={menu?.length ?? '...'}
            icon="🍔"
            color="bg-purple-50"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Estado de mesas</h3>
            {tables ? (
              <div className="grid grid-cols-3 gap-2">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`
                      rounded-lg p-3 text-center text-sm font-medium
                      ${table.status === 'occupied'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                      }
                    `}
                  >
                    Mesa {table.table_number}
                    <p className="text-xs font-normal mt-0.5">
                      {table.status === 'occupied' ? 'Ocupada' : 'Disponible'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Cargando mesas...</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Items no disponibles</h3>
            {menu ? (
              <div className="space-y-2">
                {menu.filter((item) => !item.is_available).length === 0 ? (
                  <p className="text-sm text-gray-400">Todos los items están disponibles ✅</p>
                ) : (
                  menu
                    .filter((item) => !item.is_available)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm bg-red-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-red-500 text-xs">No disponible</span>
                      </div>
                    ))
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Cargando menú...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}