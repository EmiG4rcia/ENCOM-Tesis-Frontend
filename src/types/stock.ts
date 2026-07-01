export type MovementType = 'purchase' | 'adjustment' | 'consumption' | 'waste'

export interface StockMovement {
  id: number
  ingredient_id: number
  movement_type: MovementType
  quantity: number
  notes: string | null
  created_at: string
  ingredient_name: string | null
}

export interface StockPurchase {
  quantity: number
  cost_per_unit?: number
  notes?: string
}

export interface StockAdjustment {
  quantity: number
  notes?: string
}