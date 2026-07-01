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
    <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-violet-500/20">
      <h3 className="text-lg font-bold text-white border-b border-violet-500/20 pb-3">Ficha Técnica</h3>
      
      <input type="hidden" name="appointmentId" value={appointment.id} />
      <input type="hidden" name="repairId" value={repair.id} />

      <div>
        <label className="block text-sm font-semibold text-gray-300">Estado Actual de Reparación</label>
        <select 
          name="status" 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-lg bg-white/95 text-black border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all"
        >
          <option value="pending">Pendiente (En Fila)</option>
          <option value="in_progress">En Reparación (Mesa de trabajo)</option>
          <option value="ready">Listo para Retiro</option>
          <option value="delivered">Entregado al Cliente</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300">Observaciones Técnicas (Bitácora)</label>
        <textarea 
          name="notes" 
          rows={4} 
          defaultValue={repair.technician_notes || ''}
          placeholder="Ej: Se encontró sulfato en la placa base. Se procedió a baño químico..."
          className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300">Costo Estimado / Final ($)</label>
        <div className="mt-1 relative rounded-lg shadow-inner">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-600 sm:text-sm">$</span>
          </div>
          <input 
            type="number" 
            name="cost" 
            step="0.01"
            defaultValue={repair.estimated_cost || ''}
            className="pl-7 block w-full rounded-lg bg-white/95 text-black border-0 focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" 
            placeholder="0.00" 
          />
        </div>
      </div>

      <div className="pt-2 border-t border-violet-500/20">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-fuchsia-500 transition-all uppercase tracking-wider text-sm mt-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios del Taller'}
        </button>
      </div>
    </form>
  )
}
