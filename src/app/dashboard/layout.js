import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/login/actions'
import Link from 'next/link'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar minimalista */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600">Repacell</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors">
            Lista de Turnos
          </Link>
          <Link href="/ingreso" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors">
            Nuevo Ingreso
          </Link>
        </nav>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="mb-4 text-xs font-medium text-gray-500 truncate" title={user?.email}>
            {user?.email}
          </p>
          <form action={logout}>
            <button className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded bg-white hover:bg-red-50 transition-colors">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
