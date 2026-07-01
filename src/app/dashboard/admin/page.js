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
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">Gestión de Técnicos</h1>
        <p className="text-violet-200/60 mt-2">Crea, edita o elimina los accesos del equipo técnico.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-violet-500/20 h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b border-violet-500/20 pb-2 text-white">Registrar Técnico</h2>
          <form action={addTechnician} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email del Técnico</label>
              <input name="email" type="email" placeholder="tecnico@repacell.com" required className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 border-0 p-2.5 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Contraseña temporal</label>
              <input name="password" type="text" placeholder="min. 6 caracteres" required minLength="6" className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 border-0 p-2.5 transition-all" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-fuchsia-500 transition-all uppercase tracking-wider text-sm mt-2">
              Registrar Técnico
            </button>
          </form>
        </div>

        {/* Formulario Editar */}
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-violet-500/20 h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b border-violet-500/20 pb-2 text-white">Editar (Clave)</h2>
          <form action={updateTechnicianPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Técnico a editar</label>
              <select name="userId" required className="mt-1 block w-full rounded-lg bg-white/95 text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 border-0 p-2.5 transition-all">
                <option value="">Seleccione técnico...</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Nueva Contraseña</label>
              <input name="password" type="text" placeholder="Nueva clave" required minLength="6" className="mt-1 block w-full rounded-lg bg-white/95 text-black placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 border-0 p-2.5 transition-all" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-2.5 rounded-lg shadow-[0_0_15px_rgba(217,119,6,0.3)] hover:from-yellow-500 hover:to-orange-500 transition-all uppercase tracking-wider text-sm mt-2">
              Actualizar Clave
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-violet-500/20 overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-violet-500/10">
              <thead className="bg-black/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-violet-300 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-500/10">
                {technicians.map(tech => (
                  <tr key={tech.id} className="hover:bg-violet-900/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tech.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fuchsia-400 capitalize font-bold">{tech.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <form action={deleteTechnician}>
                        <input type="hidden" name="userId" value={tech.id} />
                        <button type="submit" className="text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-900/50">Eliminar</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {technicians.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No hay técnicos registrados. Usa el formulario para agregar uno.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
