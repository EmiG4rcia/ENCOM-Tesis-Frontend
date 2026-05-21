import { useState } from 'react'
import type { MenuItem, MenuItemCreate, MenuItemUpdate } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateMenuItem, useUpdateMenuItem } from '../../hooks/useMenu'

interface MenuItemModalProps {
  item?: MenuItem
  onClose: () => void
}

const categories = ['Hamburguesas', 'Sandwiches', 'Pizzas', 'Papas Fritas', 'Bebidas']

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const isEditing = !!item

  const [form, setForm] = useState({
    category: item?.category ?? '',
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item?.price?.toString() ?? '',
    is_available: item?.is_available ?? true,
  })

  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()

  const isPending = createItem.isPending || updateItem.isPending

  const handleSubmit = () => {
    if (!form.category || !form.name || !form.price) return

    if (isEditing) {
      const data: MenuItemUpdate = {
        category: form.category,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        is_available: form.is_available,
      }
      updateItem.mutate({ id: item.id, data }, { onSuccess: onClose })
    } else {
      const data: MenuItemCreate = {
        category: form.category,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        is_available: form.is_available,
      }
      createItem.mutate(data, { onSuccess: onClose })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar item' : 'Nuevo item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Smash Clásica"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Descripción opcional"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_available"
              checked={form.is_available}
              onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_available" className="text-sm text-gray-600">
              Disponible
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear item'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}