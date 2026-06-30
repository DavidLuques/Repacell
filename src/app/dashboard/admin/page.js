import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { addTechnician, deleteTechnician, updateTechnicianPassword } from './actions'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Proteger la ruta a nivel servidor (Solo Admin) bypasseando RLS
  const { data: roleData } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id)
    .single()

  if (roleData?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Cargar lista de técnicos
  const { data: users } = await supabaseAdmin
    .from('user_roles')
    .select('user_id, role')
    .eq('role', 'technician')

  // Cargar info de usuarios desde Auth (solo admin puede hacer esto)
  const { data: { users: authUsers }, error } = await supabaseAdmin.auth.admin.listUsers()
  
  const technicians = users?.map(u => {
    const authUser = authUsers?.find(au => au.id === u.user_id)
    return {
      id: u.user_id,
      email: authUser?.email || 'Email no encontrado',
      role: u.role
    }
  }) || []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Técnicos</h1>
        <p className="text-gray-500 mt-2">Crea, edita o elimina los accesos del equipo técnico.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Registrar Técnico</h2>
          <form action={addTechnician} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email del Técnico</label>
              <input name="email" type="email" placeholder="tecnico@repacell.com" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña temporal</label>
              <input name="password" type="text" placeholder="min. 6 caracteres" required minLength="6" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded shadow-sm hover:bg-blue-700 transition-colors">
              Registrar Técnico
            </button>
          </form>
        </div>

        {/* Formulario Editar */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Editar (Clave)</h2>
          <form action={updateTechnicianPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Técnico a editar</label>
              <select name="userId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2 bg-gray-50">
                <option value="">Seleccione técnico...</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
              <input name="password" type="text" placeholder="Nueva clave" required minLength="6" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 border p-2" />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-white font-medium py-2 rounded shadow-sm hover:bg-yellow-600 transition-colors">
              Actualizar Clave
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-1 lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicians.map(tech => (
                <tr key={tech.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 capitalize font-medium">{tech.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteTechnician}>
                      <input type="hidden" name="userId" value={tech.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
              {technicians.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No hay técnicos registrados. Usa el formulario para agregar uno.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
