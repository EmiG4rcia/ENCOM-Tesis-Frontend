import { useState } from 'react'
import { useTables, useDeleteTable, useTableQR } from '../hooks/useTables'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { Badge } from '../components/Badge'
import { TableModal } from '../components/modals/TableModal'

export function TablesPage() {
  const [showModal, setShowModal] = useState(false)
  const [qrTableId, setQrTableId] = useState<number | null>(null)

  const { data: tables, isLoading } = useTables()
  const deleteTable = useDeleteTable()
  const { data: qrData } = useTableQR(qrTableId ?? 0)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Mesas" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nueva mesa" onClick={() => setShowModal(true)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables?.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-800">
                  Mesa {table.table_number}
                </h3>
                <Badge status={table.status} />
              </div>
              <p className="text-xs text-gray-400 mb-4 font-mono truncate">
                {table.qr_token}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setQrTableId(table.id)}
                  className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Ver QR
                </button>
                <IconButton
                  icon={<span className="text-sm">🗑️</span>}
                  onClick={() => deleteTable.mutate(table.id)}
                  tooltip="Eliminar mesa"
                  variant="danger"
                />
              </div>
            </div>
          ))}
        </div>

        {qrTableId && qrData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                QR — Mesa {qrData.table_number}
              </h3>
              <img
                src={`data:image/png;base64,${qrData.qr_image_base64}`}
                alt={`QR Mesa ${qrData.table_number}`}
                className="mx-auto w-48 h-48"
              />
              <p className="text-xs text-gray-400 mt-3 break-all">
                {qrData.whatsapp_url}
              </p>
              <div className="flex gap-2 mt-4">
                <a
                  href={`data:image/png;base64,${qrData.qr_image_base64}`}
                  download={`qr-mesa-${qrData.table_number}.png`}
                  className="flex-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar QR
                </a>
                <button
                  onClick={() => setQrTableId(null)}
                  className="flex-1 text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <TableModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}