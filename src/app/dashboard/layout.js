import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { logout } from '@/app/login/actions'
import Link from 'next/link'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'technician'
  if (user) {
    // Usar supabaseAdmin para bypassear RLS y garantizar la lectura
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    if (roleData) role = roleData.role
  }

  const isAdmin = role === 'admin'

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent text-gray-200 overflow-hidden">
      {/* Navbar/Sidebar responsivo */}
      <aside className="w-full md:w-64 bg-black/40 backdrop-blur-md border-b md:border-r border-violet-500/20 md:border-b-0 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(139,92,246,0.1)]">
        <div className="p-4 md:p-6 flex justify-between items-center md:items-start md:flex-col">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-sm">Repacell</h1>
            <span className="text-xs font-semibold text-violet-400/80 uppercase tracking-widest">{role}</span>
          </div>
        </div>
        
        <nav className="flex-row md:flex-col flex overflow-x-auto px-4 py-2 md:py-0 md:space-y-2 md:mt-4 flex-1 gap-2 md:gap-0 border-b border-violet-500/20 md:border-b-0">
          <Link href="/dashboard" className="shrink-0 px-4 py-2 text-sm md:text-base text-gray-300 rounded-lg hover:bg-violet-900/40 hover:text-violet-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all">
            Lista de Turnos
          </Link>
          <Link href="/dashboard/ingreso" className="shrink-0 px-4 py-2 text-sm md:text-base text-gray-300 rounded-lg hover:bg-violet-900/40 hover:text-violet-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all">
            Nuevo Ingreso
          </Link>
          {isAdmin && (
            <Link href="/dashboard/admin" className="shrink-0 px-4 py-2 text-sm md:text-base md:mt-4 text-gray-300 rounded-lg hover:bg-violet-900/40 hover:text-violet-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all">
              Gestión Técnicos
            </Link>
          )}
        </nav>
        
        <div className="hidden md:block p-4 border-t border-violet-500/20 bg-black/20">
          <p className="mb-4 text-xs font-medium text-gray-400 truncate" title={user?.email}>
            {user?.email}
          </p>
          <form action={logout}>
            <button className="w-full px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-lg bg-red-950/30 hover:bg-red-900/50 hover:text-red-300 hover:border-red-500/50 transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        {/* Mobile user info / logout */}
        <div className="md:hidden flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-xl shadow-lg mb-4 border border-violet-500/20">
           <span className="text-xs text-gray-300 truncate max-w-[200px]">{user?.email}</span>
           <form action={logout}>
            <button className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg bg-red-950/30 font-medium hover:bg-red-900/50 transition-colors">Salir</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  )
}
