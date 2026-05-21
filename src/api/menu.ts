import api from './client'
import type { MenuItem, MenuItemCreate, MenuItemUpdate } from '../types'

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const res = await api.get('/menu-items')
    return res.data
  },

  create: async (data: MenuItemCreate): Promise<MenuItem> => {
    const res = await api.post('/menu-items', data)
    return res.data
  },

  update: async (id: number, data: MenuItemUpdate): Promise<MenuItem> => {
    const res = await api.put(`/menu-items/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/menu-items/${id}`)
  },

  toggleAvailability: async (id: number): Promise<MenuItem> => {
    const res = await api.patch(`/menu-items/${id}/availability`)
    return res.data
  },
}