import api from './client'
import type { Category, CategoryCreate, CategoryUpdate } from '../types'

export const categoriesApi = {
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const res = await api.get('/categories', {
      params: includeInactive ? { include_inactive: true } : undefined,
    })
    return res.data
  },

  getById: async (id: number): Promise<Category> => {
    const res = await api.get(`/categories/${id}`)
    return res.data
  },

  create: async (data: CategoryCreate): Promise<Category> => {
    const res = await api.post('/categories', data)
    return res.data
  },

  update: async (id: number, data: CategoryUpdate): Promise<Category> => {
    const res = await api.patch(`/categories/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}