import api from './client'
import { salesClient } from './client'
import type { Customer, CustomerDetail, CustomerCreate, CustomerUpdate } from '../types'

export const customersApi = {
  getAll: async (skip = 0, limit = 50): Promise<Customer[]> => {
    const res = await api.get('/customers', { params: { skip, limit } })
    return res.data
  },

  getById: async (id: number): Promise<CustomerDetail> => {
    const res = await api.get(`/customers/${id}`)
    return res.data
  },

  create: async (data: CustomerCreate): Promise<Customer> => {
    const res = await salesClient.post('/customers', data)
    return res.data
  },

  update: async (id: number, data: CustomerUpdate): Promise<Customer> => {
    const res = await salesClient.patch(`/customers/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await salesClient.delete(`/customers/${id}`)
  },
}