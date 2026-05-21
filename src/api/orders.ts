import api from './client'
import { salesClient } from './client'
import type { Order, OrderStatusUpdate, OrderSummary, OrderCreate } from '../types'

export interface OrderFilters {
  status?: string
  table_id?: number
  customer_id?: number
  date_from?: string
  date_to?: string
  skip?: number
  limit?: number
}

export const ordersApi = {
  getAll: async (filters?: OrderFilters): Promise<Order[]> => {
    const res = await api.get('/orders', { params: filters })
    return res.data
  },

  getById: async (id: number): Promise<Order> => {
    const res = await api.get(`/orders/${id}`)
    return res.data
  },

  updateStatus: async (id: number, data: OrderStatusUpdate): Promise<Order> => {
    const res = await api.patch(`/orders/${id}/status`, data)
    return res.data
  },

  getSummary: async (): Promise<OrderSummary> => {
    const res = await api.get('/orders/summary')
    return res.data
  },

  create: async (data: OrderCreate): Promise<Order> => {
    const res = await salesClient.post('/orders', data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await salesClient.delete(`/orders/${id}`)
  },
}