import { salesClient } from './client'
import type { StockMovement, StockPurchase, StockAdjustment } from '../types'

export const stockApi = {
  getMovements: async (ingredientId?: number, skip = 0, limit = 50): Promise<StockMovement[]> => {
    const res = await salesClient.get('/stock', {
      params: {
        ...(ingredientId ? { ingredient_id: ingredientId } : {}),
        skip,
        limit,
      },
    })
    return res.data
  },

  purchase: async (ingredientId: number, data: StockPurchase): Promise<StockMovement> => {
    const res = await salesClient.post(`/stock/purchase/${ingredientId}`, data)
    return res.data
  },

  adjust: async (ingredientId: number, data: StockAdjustment): Promise<StockMovement> => {
    const res = await salesClient.post(`/stock/adjustment/${ingredientId}`, data)
    return res.data
  },
}