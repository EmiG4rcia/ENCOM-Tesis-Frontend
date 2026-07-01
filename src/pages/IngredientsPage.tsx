import { useState } from 'react'
import { useIngredients, useDeleteIngredient } from '../hooks/useIngredients'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { IngredientModal } from '../components/modals/IngredientModal'
import { formatQuantity, formatUnit } from '../utils/format'
import type { Ingredient } from '../types'

export function IngredientsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>()

  const { data: ingredients, isLoading } = useIngredients(true)
  const deleteIngredient = useDeleteIngredient()

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro? Solo podés eliminar ingredientes sin productos asociados.')) {
      deleteIngredient.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingIngredient(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Ingredientes" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo ingrediente" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredients?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay ingredientes creados
                  </td>
                </tr>
              ) : (
                ingredients?.map((ingredient) => (
                  <tr
                    key={ingredient.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      ingredient.is_low_stock ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-500">{ingredient.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        {ingredient.is_allergen && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                            Alérgeno
                          </span>
                        )}
                        {ingredient.is_low_stock && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            ⚠ Stock bajo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatUnit(ingredient.unit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${ingredient.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatQuantity(ingredient.stock_quantity, ingredient.unit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatQuantity(ingredient.stock_min_alert, ingredient.unit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full
                        ${ingredient.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                        }`}>
                        {ingredient.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <IconButton
                          icon={<span className="text-sm">✏️</span>}
                          onClick={() => handleEdit(ingredient)}
                          tooltip="Editar"
                        />
                        <IconButton
                          icon={<span className="text-sm">🗑️</span>}
                          onClick={() => handleDelete(ingredient.id)}
                          tooltip="Eliminar"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <IngredientModal ingredient={editingIngredient} onClose={handleCloseModal} />
      )}
    </div>
  )
}