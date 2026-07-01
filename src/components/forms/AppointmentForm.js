'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema } from '@/lib/schema'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AppointmentForm() {
  const router = useRouter()
  const supabase = createClient()
  const [baseSlots, setBaseSlots] = useState([])
  const [occupiedSlots, setOccupiedSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
  })

  const selectedDate = watch('scheduled_date')

  useEffect(() => {
    async function fetchBaseSlots() {
      const { data } = await supabase
        .from('time_slots')
        .select('start_time')
        .eq('is_active', true)
        .order('start_time')
      if (data) {
        setBaseSlots(data.map(s => s.start_time))
      }
    }
    fetchBaseSlots()
  }, [supabase])

  useEffect(() => {
    if (!selectedDate) return

    async function fetchOccupiedSlots() {
      setLoadingSlots(true)
      const { data, error } = await supabase
        .from('appointments')
        .select('scheduled_time')
        .eq('scheduled_date', selectedDate)
        
      if (!error && data) {
        setOccupiedSlots(data.map(a => a.scheduled_time))
      }
      setLoadingSlots(false)
    }

    fetchOccupiedSlots()
  }, [selectedDate, supabase])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const { error } = await supabase
      .from('appointments')
      .insert([data])

    if (error) {
      alert('Error al guardar el turno: ' + error.message)
      setIsSubmitting(false)
    } else {
      router.push('/dashboard')
    }
  }

  const formatTime = (time) => time.slice(0, 5)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cliente */}
        <div className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-500/20">
          <h3 className="text-lg font-medium border-b border-violet-500/20 pb-2 text-white">Datos del Cliente</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre Completo</label>
            <input {...register('client_name')} className="mt-1 block w-full rounded-lg bg-white/95 text-black border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" />
            {errors.client_name && <p className="text-red-400 text-sm mt-1">{errors.client_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Teléfono</label>
            <input {...register('phone')} type="tel" className="mt-1 block w-full rounded-lg bg-white/95 text-black border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Dispositivo */}
        <div className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-500/20">
          <h3 className="text-lg font-medium border-b border-violet-500/20 pb-2 text-white">Dispositivo</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300">Marca</label>
            <input {...register('device_brand')} placeholder="Ej: Apple, Samsung" className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" />
            {errors.device_brand && <p className="text-red-400 text-sm mt-1">{errors.device_brand.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Modelo</label>
            <input {...register('device_model')} placeholder="Ej: iPhone 13 Pro" className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" />
            {errors.device_model && <p className="text-red-400 text-sm mt-1">{errors.device_model.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-500/20">
        <label className="block text-sm font-medium text-gray-300">Falla o problema reportado</label>
        <textarea {...register('issue_description')} rows={3} placeholder="Detalla el problema que menciona el cliente..." className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all"></textarea>
        {errors.issue_description && <p className="text-red-400 text-sm mt-1">{errors.issue_description.message}</p>}
      </div>

      <div className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-500/20">
        <h3 className="text-lg font-medium border-b border-violet-500/20 pb-2 text-white">Asignación de Turno</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Fecha del turno</label>
            <input type="date" {...register('scheduled_date')} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-lg bg-white/95 text-black border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all" />
            {errors.scheduled_date && <p className="text-red-400 text-sm mt-1">{errors.scheduled_date.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Horario (Slots dinámicos)</label>
            <select {...register('scheduled_time')} disabled={!selectedDate || loadingSlots} className="mt-1 block w-full rounded-lg bg-white/95 text-black border-0 shadow-inner focus:ring-2 focus:ring-violet-500 p-2.5 transition-all disabled:opacity-50">
              <option value="">{loadingSlots ? 'Consultando disponibilidad...' : (selectedDate ? 'Selecciona una hora disponible' : 'Primero elige una fecha')}</option>
              {baseSlots.map(slot => {
                const isOccupied = occupiedSlots.includes(slot)
                return (
                  <option key={slot} value={slot} disabled={isOccupied} className={isOccupied ? 'text-gray-400' : 'text-gray-900'}>
                    {formatTime(slot)} {isOccupied ? '(Ocupado)' : ''}
                  </option>
                )
              })}
            </select>
            {errors.scheduled_time && <p className="text-red-500 text-sm mt-1">{errors.scheduled_time.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-violet-500/20">
        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all uppercase tracking-wider text-sm">
          {isSubmitting ? 'Guardando...' : 'Crear Turno de Ingreso'}
        </button>
      </div>
    </form>
  )
}
