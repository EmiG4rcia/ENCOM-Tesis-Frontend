import { useState } from 'react'
import { useCustomers, useCustomer, useDeleteCustomer } from '../hooks/useCustomers'
import { isSalesTokenValid } from '../hooks/useSalesToken'
import { Navbar } from '../components/layout/Navbar'
import { Table } from '../components/Table'
import { PrimaryButton, IconButton } from '../components/buttons'
import { CustomerModal } from '../components/modals/CustomerModal'
import { SalesVerifyModal } from '../components/modals/SalesVerifyModal'
import type { Customer } from '../types'

export function CustomersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>()
  const [isVerified, setIsVerified] = useState(isSalesTokenValid())

  const { data: customers, isLoading } = useCustomers()
  const { data: detail } = useCustomer(selectedId ?? 0)
  const deleteCustomer = useDeleteCustomer()

  const requireVerification = (onVerified: () => void) => {
    if (isVerified) {
      onVerified()
    } else {
      setShowVerifyModal(true)
    }
  }

  const handleEdit = (customer: Customer) => {
    requireVerification(() => {
      setEditingCustomer(customer)
      setShowModal(true)
    })
  }

  const handleDelete = (id: number) => {
    requireVerification(() => {
      if (confirm('¿Estás seguro de que querés eliminar este cliente?')) {
        deleteCustomer.mutate(id, {
          onSuccess: () => {
            if (selectedId === id) setSelectedId(null)
          },
        })
      }
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCustomer(undefined)
  }

  const columns = [
    { header: '#', accessor: 'id' as keyof Customer },
    { header: 'Nombre', accessor: (row: Customer) => row.name ?? '-' },
    { header: 'Teléfono', accessor: 'phone_number' as keyof Customer },
    { header: 'Pedidos', accessor: 'total_orders' as keyof Customer },
    {
      header: 'Registrado',
      accessor: (row: Customer) =>
        new Date(row.created_at).toLocaleDateString('es-AR'),
    },
    {
      header: 'Acciones',
      accessor: (row: Customer) => (
        <div className="flex gap-1">
          <IconButton
            icon={<span className="text-sm">✏️</span>}
            onClick={(e) => { e?.stopPropagation(); handleEdit(row) }}
            tooltip="Editar"
          />
          <IconButton
            icon={<span className="text-sm">🗑️</span>}
            onClick={(e) => { e?.stopPropagation(); handleDelete(row.id) }}
            tooltip="Eliminar"
            variant="danger"
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Clientes" />
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-end">
            <PrimaryButton
              label="+ Nuevo cliente"
              onClick={() => requireVerification(() => setShowModal(true))}
            />
          </div>
          <Table
            columns={columns}
            data={customers ?? []}
            isLoading={isLoading}
            emptyMessage="No hay clientes registrados"
            onRowClick={(customer) => setSelectedId(customer.id)}
          />
        </div>

        {selectedId && detail && (
          <div className="w-80 bg-white rounded-xl border border-gray-200 p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Detalle del cliente</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Nombre</p>
                <p className="font-medium text-gray-800">{detail.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-800">{detail.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Registrado</p>
                <p className="font-medium text-gray-800">
                  {new Date(detail.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-2">Historial de pedidos</p>
                {detail.orders.length === 0 ? (
                  <p className="text-gray-400 text-xs">Sin pedidos aún</p>
                ) : (
                  <div className="space-y-1">
                    {detail.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg text-xs"
                      >
                        <span className="text-gray-600">Pedido #{order.id}</span>
                        <span className="text-gray-500">${order.total_amount ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <CustomerModal customer={editingCustomer} onClose={handleCloseModal} />
      )}

      {showVerifyModal && (
        <SalesVerifyModal
          onSuccess={() => {
            setIsVerified(true)
            setShowVerifyModal(false)
            setShowModal(true)
          }}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  )
}