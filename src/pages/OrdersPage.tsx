import { useState } from 'react'
import { useOrders, useDeleteOrder } from '../hooks/useOrders'
import { isSalesTokenValid } from '../hooks/useSalesToken'
import { Navbar } from '../components/layout/Navbar'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { PrimaryButton, IconButton } from '../components/buttons'
import { OrderModal } from '../components/modals/OrderModal'
import { OrderCreateModal } from '../components/modals/OrderCreateModal'
import { SalesVerifyModal } from '../components/modals/SalesVerifyModal'
import type { Order } from '../types'

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'ready', label: 'Listo' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]


export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [isVerified, setIsVerified] = useState(isSalesTokenValid())

  const { data: orders, isLoading } = useOrders(
    statusFilter ? { status: statusFilter } : undefined
  )
  const deleteOrder = useDeleteOrder()

  const requireVerification = (onVerified: () => void) => {
    if (isVerified) {
      onVerified()
    } else {
      setShowVerifyModal(true)
    }
  }

  const handleDelete = (id: number) => {
    requireVerification(() => {
      if (confirm('¿Estás seguro de que querés eliminar este pedido?')) {
        deleteOrder.mutate(id)
      }
    })
  }

  const columns = [
    { header: '#', accessor: 'id' as keyof Order },
    { header: 'Cliente', accessor: (row: Order) => row.customer_name ?? '-' },
    { header: 'Mesa', accessor: (row: Order) => row.table_number ?? '-' },
    {
      header: 'Total',
      accessor: (row: Order) => row.total_amount ? `$${row.total_amount}` : '-',
    },
    {
      header: 'Estado',
      accessor: (row: Order) => <Badge status={row.status} />,
    },
    {
      header: 'Fecha',
      accessor: (row: Order) =>
        new Date(row.created_at).toLocaleDateString('es-AR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
    },
    {
      header: 'Acciones',
      accessor: (row: Order) => (
        <IconButton
          icon={<span className="text-sm">🗑️</span>}
          onClick={(e) => { e?.stopPropagation(); handleDelete(row.id) }}
          tooltip="Eliminar pedido"
          variant="danger"
        />
      ),
    },
  ]



  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Pedidos" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <PrimaryButton
            label="+ Nuevo pedido"
            onClick={() => requireVerification(() => setShowCreateModal(true))}
          />
        </div>

        <Table
          columns={columns}
          data={orders ?? []}
          isLoading={isLoading}
          emptyMessage="No hay pedidos para mostrar"
          onRowClick={(order) => setSelectedOrder(order)}
        />
      </main>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {showCreateModal && (
        <OrderCreateModal onClose={() => setShowCreateModal(false)} />
      )}

      {showVerifyModal && (
        <SalesVerifyModal
          onSuccess={() => {
            setIsVerified(true)
            setShowVerifyModal(false)
            setShowCreateModal(true)
          }}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  )
}