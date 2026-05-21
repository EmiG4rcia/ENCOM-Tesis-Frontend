import api from './client'
import type{ Table, TableCreate, TableUpdate, TableQR } from '../types'

export const tablesApi = {
  getAll: async (): Promise<Table[]> => {
    const res = await api.get('/tables')
    return res.data
  },

  create: async (data: TableCreate): Promise<Table> => {
    const res = await api.post('/tables', data)
    return res.data
  },

  update: async (id: number, data: TableUpdate): Promise<Table> => {
    const res = await api.put(`/tables/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tables/${id}`)
  },

  getQR: async (id: number): Promise<TableQR> => {
    const res = await api.get(`/tables/${id}/qr`)
    return res.data
  },
}