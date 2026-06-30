'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRepairStatus(formData) {
  const supabase = await createClient()
  
  const appointmentId = formData.get('appointmentId')
  const repairId = formData.get('repairId')
  const status = formData.get('status')
  const notes = formData.get('notes')
  const cost = formData.get('cost') || null

  // Actualizar estado en appointments
  const { error: aptError } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)

  if (aptError) throw new Error(aptError.message)

  // Actualizar notas técnicas y costo
  if (repairId) {
    const { error: repError } = await supabase
      .from('repairs')
      .update({ 
        technician_notes: notes,
        estimated_cost: cost 
      })
      .eq('id', repairId)
      
    if (repError) throw new Error(repError.message)
  }

  revalidatePath(`/dashboard/reparacion/${appointmentId}`)
  revalidatePath('/dashboard')
}

export async function saveImageRecord(repairId, imageUrl, type) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('repair_images')
    .insert([{ repair_id: repairId, image_url: imageUrl, type }])
    
  if (error) throw new Error(error.message)
}
