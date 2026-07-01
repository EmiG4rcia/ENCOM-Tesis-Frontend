import { salesClient } from './client'
import type { Payment, PaymentStatusUpdate, PaymentCreate, SalesSummary } from '../types'

export const salesApi = {
  getSummary: async (): Promise<SalesSummary> => {
    const res = await salesClient.get('/sales/summary')
    return res.data
  },

  getPayments: async (status?: string): Promise<Payment[]> => {
    const res = await salesClient.get('/sales/payments', {
      params: status ? { status } : undefined,
    })
    return res.data
  },

  updatePaymentStatus: async (
    id: number,
    data: PaymentStatusUpdate
  ): Promise<Payment> => {
    const res = await salesClient.patch(`/sales/payments/${id}`, data)
    return res.data
  },

  createPayment: async (data: PaymentCreate): Promise<Payment> => {
    const res = await salesClient.post('/sales/payments', data)
    return res.data
  },
}