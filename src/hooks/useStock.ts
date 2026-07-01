import { useQuery, useMutation } from '@tanstack/react-query'
import { stockApi } from '../api/stock'
import type { StockPurchase, StockAdjustment } from '../types'
import { queryClient } from '../api/client'

export function useStockMovements(ingredientId?: number) {
  return useQuery({
    queryKey: ['stock', 'movements', ingredientId],
    queryFn: () => stockApi.getMovements(ingredientId),
  })
}

export function usePurchaseStock() {
  return useMutation({
    mutationFn: ({ ingredientId, data }: { ingredientId: number; data: StockPurchase }) =>
      stockApi.purchase(ingredientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}

export function useAdjustStock() {
  return useMutation({
    mutationFn: ({ ingredientId, data }: { ingredientId: number; data: StockAdjustment }) =>
      stockApi.adjust(ingredientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}