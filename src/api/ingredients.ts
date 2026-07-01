import api from './client'
import type {
  Ingredient,
  IngredientCreate,
  IngredientUpdate,
  MenuItemIngredientCreate,
  MenuItemIngredientResponse,
} from '../types'

export const ingredientsApi = {
  getAll: async (includeInactive = false): Promise<Ingredient[]> => {
    const res = await api.get('/ingredients', {
      params: includeInactive ? { include_inactive: true } : undefined,
    })
    return res.data
  },

  getById: async (id: number): Promise<Ingredient> => {
    const res = await api.get(`/ingredients/${id}`)
    return res.data
  },

  create: async (data: IngredientCreate): Promise<Ingredient> => {
    const res = await api.post('/ingredients', data)
    return res.data
  },

  update: async (id: number, data: IngredientUpdate): Promise<Ingredient> => {
    const res = await api.patch(`/ingredients/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/ingredients/${id}`)
  },

  getMenuItemIngredients: async (menuItemId: number): Promise<MenuItemIngredientResponse[]> => {
    const res = await api.get(`/ingredients/menu-item/${menuItemId}`)
    return res.data
  },

  addToMenuItem: async (
    menuItemId: number,
    data: MenuItemIngredientCreate
  ): Promise<MenuItemIngredientResponse> => {
    const res = await api.post(`/ingredients/menu-item/${menuItemId}`, data)
    return res.data
  },

  removeFromMenuItem: async (menuItemId: number, ingredientId: number): Promise<void> => {
    await api.delete(`/ingredients/menu-item/${menuItemId}/${ingredientId}`)
  },
}