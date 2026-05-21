import { useState } from 'react'
import { useSalesSummary, usePayments, useUpdatePaymentStatus } from '../hooks/useSales'
import { isSalesTokenValid } from '../hooks/useSalesToken'
import { Navbar } from '../components/layout/Navbar'
import { Badge } from '../components/Badge'
import { PrimaryButton } from '../components/buttons'
import { SalesVerifyModal } from '../components/modals/SalesVerifyModal'
import { PaymentModal } from '../components/modals/PaymentModal'

export function SalesPage() {
  const [isVerified, setIsVerified] = useState(isSalesTokenValid())
  const [showVerifyModal, setShowVerifyModal] = useState(!isVerified)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const { data: summary } = useSalesSummary()
  const { data: payments, isLoading } = usePayments()
  const updatePayment = useUpdatePaymentStatus()

  const handleVerified = () => {
    setIsVerified(true)
    setShowVerifyModal(false)
  }

  if (showVerifyModal) {
    return (
      <div className="flex-1 flex flex-col">
        <Navbar title="Ventas" />
        <SalesVerifyModal
          onSuccess={handleVerified}
          onClose={() => setShowVerifyModal(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Ventas" />
      <main className="flex-1 p-6">
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total pedidos</p>
              <p className="text-2xl font-bold text-gray-800">{summary.total_orders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Ingresos totales</p>
              <p className="text-2xl font-bold text-green-600">${summary.total_revenue}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Pagos completados</p>
              <p className="text-2xl font-bold text-gray-800">{summary.completed_payments}</p>
            </div>
            <div className="bg-white rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs text-yellow-600">Pendientes de confirmar</p>
              <p className="text-2xl font-bold text-yellow-700">{summary.payment_received_pending}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Pagos</h3>
            <PrimaryButton
              label="+ Registrar pago"
              onClick={() => setShowPaymentModal(true)}
              size="sm"
            />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mesa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Monto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Método</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No hay pagos registrados
                    </td>
                  </tr>
                ) : (
                  payments?.map((payment) => (
                    <tr
                      key={payment.id}
                      className={`
                        ${payment.status === 'payment_received' ? 'bg-yellow-50' : 'bg-white'}
                        hover:bg-gray-50 transition-colors
                      `}
                    >
                      <td className="px-4 py-3 text-gray-700">{payment.id}</td>
                      <td className="px-4 py-3 text-gray-700">{payment.customer_name ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{payment.table_number ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">${payment.amount ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{payment.method}</td>
                      <td className="px-4 py-3">
                        <Badge status={payment.status} />
                      </td>
                      <td className="px-4 py-3">
                        {payment.status === 'payment_received' && (
                          <button
                            onClick={() =>
                              updatePayment.mutate({
                                id: payment.id,
                                data: { status: 'completed' },
                              })
                            }
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Confirmar pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  )
}