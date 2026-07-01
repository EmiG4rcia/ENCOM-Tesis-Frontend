import { useState } from 'react'
import { useIngredients } from '../hooks/useIngredients'
import { useStockMovements } from '../hooks/useStock'
import { isSalesTokenValid } from '../hooks/useSalesToken'
import { Navbar } from '../components/layout/Navbar'
import { SalesVerifyModal } from '../components/modals/SalesVerifyModal'
import { StockModal } from '../components/modals/StockModal'
import { PrimaryButton, SecondaryButton } from '../components/buttons'
import { formatQuantity } from '../utils/format'
import type { Ingredient } from '../types'

export function StockPage() {
  const [isVerified, setIsVerified] = useState(isSalesTokenValid())
  const [showVerifyModal, setShowVerifyModal] = useState(!isVerified)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [stockMode, setStockMode] = useState<'purchase' | 'adjustment'>('purchase')
  const [filterIngredientId, setFilterIngredientId] = useState<number | undefined>()

  const { data: ingredients } = useIngredients()
  const { data: movements, isLoading } = useStockMovements(filterIngredientId)

  const handleVerified = () => {
    setIsVerified(true)
    setShowVerifyModal(false)
  }

  const openStockModal = (ingredient: Ingredient, mode: 'purchase' | 'adjustment') => {
    setSelectedIngredient(ingredient)
    setStockMode(mode)
  }

  if (showVerifyModal) {
    return (
      <div className="flex-1 flex flex-col">
        <Navbar title="Stock" />
        <SalesVerifyModal
          onSuccess={handleVerified}
          onClose={() => setShowVerifyModal(false)}
        />
      </div>
    )
  }

  const lowStockIngredients = ingredients?.filter((i) => i.is_low_stock) ?? []

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Stock" />
      <main className="flex-1 p-6 space-y-6">

        {lowStockIngredients.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">
              ⚠ {lowStockIngredients.length} ingrediente{lowStockIngredients.length > 1 ? 's' : ''} con stock bajo
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockIngredients.map((i) => (
                <span key={i.id} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {i.name} — {i.stock_quantity} {i.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Ingredientes</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredients?.map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className={`hover:bg-gray-50 ${ingredient.is_low_stock ? 'bg-red-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                      {ingredient.is_low_stock && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                          ⚠ Bajo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${ingredient.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatQuantity(ingredient.stock_quantity, ingredient.unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatQuantity(ingredient.stock_min_alert, ingredient.unit)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openStockModal(ingredient, 'purchase')}
                        className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        + Compra
                      </button>
                      <button
                        onClick={() => openStockModal(ingredient, 'adjustment')}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Ajuste
                      </button>
                      <button
                        onClick={() => setFilterIngredientId(
                          filterIngredientId === ingredient.id ? undefined : ingredient.id
                        )}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                          ${filterIngredientId === ingredient.id
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        Historial
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Movimientos {filterIngredientId ? `— ${ingredients?.find(i => i.id === filterIngredientId)?.name}` : ''}
            </h3>
            {filterIngredientId && (
              <button
                onClick={() => setFilterIngredientId(undefined)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Ver todos ×
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <span className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ingrediente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Notas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No hay movimientos registrados
                    </td>
                  </tr>
                ) : (
                  movements?.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{movement.ingredient_name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full
                          ${movement.movement_type === 'purchase' ? 'bg-green-100 text-green-700' :
                            movement.movement_type === 'consumption' ? 'bg-blue-100 text-blue-700' :
                            movement.movement_type === 'waste' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {movement.movement_type === 'purchase' ? 'Compra' :
                           movement.movement_type === 'consumption' ? 'Consumo' :
                           movement.movement_type === 'waste' ? 'Merma' : 'Ajuste'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-medium
                        ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {movement.quantity > 0 ? '+' : ''}{Math.abs(movement.quantity).toLocaleString('es-AR', { maximumFractionDigits: 3 })}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{movement.notes ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(movement.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {selectedIngredient && (
        <StockModal
          ingredient={selectedIngredient}
          mode={stockMode}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  )
}