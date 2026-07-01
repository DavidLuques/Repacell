'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")
  
  const { data: roleData } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
    
  if (roleData?.role !== 'admin') {
    throw new Error("No autorizado. Solo los administradores pueden hacer esto.")
  }
}

export async function addTechnician(formData) {
  await requireAdmin()
  
  const email = formData.get('email')
  const password = formData.get('password')

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true 
  })

  if (authError) {
    console.error("Error al crear usuario:", authError)
    throw new Error(authError.message)
  }

  const { error: dbError } = await supabaseAdmin
    .from('user_roles')
    .insert([{ user_id: authData.user.id, role: 'technician' }])

  if (dbError) {
    console.error("Error asignando rol:", dbError)
    throw new Error(dbError.message)
  }

  revalidatePath('/dashboard/admin')
}

export async function deleteTechnician(formData) {
  await requireAdmin()
  
  const userId = formData.get('userId')
  
  // 1. Eliminar primero de la tabla de la base de datos pública para evitar violaciones de clave foránea (FK)
  const { error: dbError } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .eq('user_id', userId)

  if (dbError) {
    console.error("Error al eliminar rol en DB:", dbError)
    throw new Error(dbError.message)
  }

  // 2. Eliminar el usuario de Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (error) {
    console.error("Error al eliminar técnico en Auth:", error)
    throw new Error(error.message)
  }
  
  revalidatePath('/dashboard/admin')
}

export async function updateTechnicianPassword(formData) {
  await requireAdmin()
  
  const userId = formData.get('userId')
  const newPassword = formData.get('password')

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  })
  
  if (error) {
    console.error("Error al actualizar contraseña:", error)
    throw new Error(error.message)
  }
  
  revalidatePath('/dashboard/admin')
}
