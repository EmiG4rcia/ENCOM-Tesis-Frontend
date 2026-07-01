import { useState } from 'react'
import { useMenu, useDeleteMenuItem, useToggleAvailability } from '../hooks/useMenu'
import { useCategories } from '../hooks/useCategories'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { MenuItemModal } from '../components/modals/MenuItemModal'
import type { MenuItem } from '../types'

export function MenuPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const { data: items, isLoading } = useMenu()
  const { data: categories } = useCategories()
  const deleteItem = useDeleteMenuItem()
  const toggleAvailability = useToggleAvailability()

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(undefined)
  }

  const filteredItems = selectedCategoryId
    ? items?.filter((item) => item.category_id === selectedCategoryId)
    : items

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Menú" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedCategoryId === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                }`}
            >
              Todos
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${selectedCategoryId === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <PrimaryButton label="+ Nuevo item" onClick={() => setShowModal(true)} />
        </div>

        {filteredItems?.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No hay items en esta categoría
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems?.map((item) => (
              <div
                key={item.id}
                className={`
                  bg-white rounded-xl border p-4 flex flex-col gap-2
                  ${item.is_available ? 'border-gray-200' : 'border-red-200 opacity-60'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    {item.category && (
                      <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-blue-600 ml-2">${item.price}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <button
                    onClick={() => toggleAvailability.mutate(item.id)}
                    className={`text-xs font-medium px-2 py-1 rounded-full transition-colors
                      ${item.is_available
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                  >
                    {item.is_available ? '✓ Disponible' : '✗ No disponible'}
                  </button>
                  <div className="flex gap-1">
                    <IconButton
                      icon={<span className="text-sm">✏️</span>}
                      onClick={() => handleEdit(item)}
                      tooltip="Editar"
                    />
                    <IconButton
                      icon={<span className="text-sm">🗑️</span>}
                      onClick={() => deleteItem.mutate(item.id)}
                      tooltip="Eliminar"
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <MenuItemModal item={editingItem} onClose={handleCloseModal} />
      )}
    </div>
  )
}