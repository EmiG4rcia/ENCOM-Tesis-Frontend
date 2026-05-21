export interface MenuItem {
  id: number
  category: string | null
  name: string | null
  description: string | null
  price: number | null
  is_available: boolean
  popularity_score: number
}

export interface MenuItemCreate {
  category: string
  name: string
  description?: string
  price: number
  is_available: boolean
}

export interface MenuItemUpdate {
  category?: string
  name?: string
  description?: string
  price?: number
  is_available?: boolean
}