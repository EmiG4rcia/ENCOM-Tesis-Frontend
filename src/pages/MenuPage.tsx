import { useState } from 'react'
import { useMenu, useDeleteMenuItem, useToggleAvailability } from '../hooks/useMenu'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, DangerButton, IconButton } from '../components/buttons'
import { MenuItemModal } from '../components/modals/MenuItemModal'
import type { MenuItem } from '../types'

export function MenuPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>()

  const { data: items, isLoading } = useMenu()
  const deleteItem = useDeleteMenuItem()
  const toggleAvailability = useToggleAvailability()

  const categories = [...new Set(items?.map((i) => i.category).filter(Boolean))]

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(undefined)
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
      <Navbar title="Menú" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo item" onClick={() => setShowModal(true)} />
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items
                ?.filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`
                      bg-white rounded-xl border p-4 flex flex-col gap-2
                      ${item.is_available ? 'border-gray-200' : 'border-red-200 opacity-60'}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">${item.price}</p>
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
          </div>
        ))}
      </main>

      {showModal && (
        <MenuItemModal item={editingItem} onClose={handleCloseModal} />
      )}
    </div>
  )
}