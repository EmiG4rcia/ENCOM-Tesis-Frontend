import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreatePayment } from '../../hooks/useSales'
import { useOrders } from '../../hooks/useOrders'

interface PaymentModalProps {
  onClose: () => void
}

export function PaymentModal({ onClose }: PaymentModalProps) {
  const [orderId, setOrderId] = useState<number | ''>('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('cash')
  const [error, setError] = useState('')

  const { data: orders } = useOrders({ status: 'delivered' })
  const createPayment = useCreatePayment()

  const handleSubmit = () => {
    if (!orderId || !amount) {
      setError('Completá todos los campos obligatorios')
      return
    }
    setError('')

    createPayment.mutate(
      {
        order_id: Number(orderId),
        amount: parseFloat(amount),
        method,
      },
      {
        onSuccess: onClose,
        onError: () => setError('Error al registrar el pago. Verificá que el pedido no tenga un pago ya registrado.'),
      }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Registrar pago</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Pedido <span className="text-red-500">*</span>
            </label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar pedido</option>
              {orders?.map((o) => (
                <option key={o.id} value={o.id}>
                  Pedido #{o.id} — {o.customer_name ?? 'Sin cliente'} — ${o.total_amount ?? '-'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Monto <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Método de pago</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="qr_payment">QR / Transferencia</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label="Registrar pago"
            onClick={handleSubmit}
            isLoading={createPayment.isPending}
          />
        </div>
      </div>
    </div>
  )
}