'use client'

import { useState } from 'react'
import { updateRepairStatus } from '@/app/dashboard/reparacion/[id]/actions'

export default function RepairForm({ appointment, repair }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(appointment.status)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    try {
      await updateRepairStatus(formData)
      alert("¡Actualizado con éxito!")
    } catch (error) {
      alert("Error al actualizar: " + error.message)
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Ficha Técnica</h3>
      
      <input type="hidden" name="appointmentId" value={appointment.id} />
      <input type="hidden" name="repairId" value={repair.id} />

      <div>
        <label className="block text-sm font-semibold text-gray-700">Estado Actual de Reparación</label>
        <select 
          name="status" 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2 bg-gray-50"
        >
          <option value="pending">Pendiente (En Fila)</option>
          <option value="in_progress">En Reparación (Mesa de trabajo)</option>
          <option value="ready">Listo para Retiro</option>
          <option value="delivered">Entregado al Cliente</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Observaciones Técnicas (Bitácora)</label>
        <textarea 
          name="notes" 
          rows={4} 
          defaultValue={repair.technician_notes || ''}
          placeholder="Ej: Se encontró sulfato en la placa base. Se procedió a baño químico..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Costo Estimado / Final ($)</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input 
            type="number" 
            name="cost" 
            step="0.01"
            defaultValue={repair.estimated_cost || ''}
            className="pl-7 block w-full rounded-md border-gray-300 focus:border-blue-500 border p-2" 
            placeholder="0.00" 
          />
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors disabled:opacity-70"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios del Taller'}
        </button>
      </div>
    </form>
  )
}
