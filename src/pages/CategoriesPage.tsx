import { useState } from 'react'
import { useCategories, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { CategoryModal } from '../components/modals/CategoryModal'
import type { Category } from '../types'

export function CategoriesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const { data: categories, isLoading } = useCategories(true)
  const deleteCategory = useDeleteCategory()
  const updateCategory = useUpdateCategory()

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleToggleActive = (category: Category) => {
    updateCategory.mutate({
      id: category.id,
      data: { is_active: !category.is_active },
    })
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro? Solo podés eliminar categorías sin productos asociados.')) {
      deleteCategory.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(undefined)
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
      <Navbar title="Categorías" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nueva categoría" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Creada</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No hay categorías creadas
                  </td>
                </tr>
              ) : (
                categories?.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{category.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{category.name}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`text-xs font-medium px-2 py-1 rounded-full transition-colors
                          ${category.is_active
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-500 hover:bg-red-100'
                          }`}
                      >
                        {category.is_active ? '✓ Activa' : '✗ Inactiva'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(category.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <IconButton
                          icon={<span className="text-sm">✏️</span>}
                          onClick={() => handleEdit(category)}
                          tooltip="Editar"
                        />
                        <IconButton
                          icon={<span className="text-sm">🗑️</span>}
                          onClick={() => handleDelete(category.id)}
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
        <CategoryModal category={editingCategory} onClose={handleCloseModal} />
      )}
    </div>
  )
}