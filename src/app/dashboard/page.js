import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Wrench, CheckCircle, Package, Search } from 'lucide-react'

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-500/30', icon: Calendar },
  in_progress: { label: 'En Reparación', color: 'bg-violet-900/40 text-violet-300 border-violet-500/30', icon: Wrench },
  ready: { label: 'Listo p/ Retiro', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
  delivered: { label: 'Entregado', color: 'bg-gray-800/60 text-gray-300 border-gray-600/50', icon: Package }
}

const FilterButton = ({ status, label, currentFilter }) => {
  const isActive = currentFilter === status
  return (
    <Link 
      href={`/dashboard${status === 'all' ? '' : `?status=${status}`}`}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
        isActive 
          ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] border-transparent' 
          : 'bg-black/40 text-gray-400 border border-violet-500/20 hover:bg-violet-900/30 hover:text-violet-300 hover:border-violet-500/40'
      }`}
    >
      {label}
    </Link>
  )
}

export default async function DashboardPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const currentFilter = awaitedSearchParams?.status || 'all'
  
  const supabase = await createClient()
  
  let query = supabase
    .from('appointments')
    .select('*')
    .order('scheduled_date', { ascending: true })
    .order('scheduled_time', { ascending: true })

  if (currentFilter !== 'all') {
    query = query.eq('status', currentFilter)
  }

  const { data: appointments } = await query

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-violet-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Panel de Recepción</h1>
          <p className="text-violet-200/60 mt-1">Gestión general de turnos y equipos en el taller.</p>
        </div>
        <Link 
          href="/dashboard/ingreso" 
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-fuchsia-500 font-medium transition-all"
        >
          + Nuevo Ingreso
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <FilterButton status="all" label="Todos los turnos" currentFilter={currentFilter} />
        <FilterButton status="pending" label="Pendientes" currentFilter={currentFilter} />
        <FilterButton status="in_progress" label="En Reparación" currentFilter={currentFilter} />
        <FilterButton status="ready" label="Listos" currentFilter={currentFilter} />
      </div>

      {/* Tabla de Datos */}
      <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-violet-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-violet-500/10">
            <thead className="bg-black/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Dispositivo / Falla</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-violet-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/10">
              {appointments?.map((apt) => {
                const config = statusConfig[apt.status] || statusConfig.pending
                const Icon = config.icon
                
                return (
                  <tr key={apt.id} className="hover:bg-violet-900/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{apt.scheduled_date}</div>
                      <div className="text-sm text-gray-400 font-medium">{apt.scheduled_time.slice(0, 5)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-white">{apt.client_name}</div>
                      <div className="text-sm text-gray-400">{apt.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{apt.device_brand} {apt.device_model}</div>
                      <div className="text-sm text-gray-400 line-clamp-2 max-w-sm mt-0.5" title={apt.issue_description}>
                        {apt.issue_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.color} shadow-sm`}>
                        <Icon size={14} strokeWidth={2.5} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/dashboard/reparacion/${apt.id}`}
                        className="inline-flex items-center gap-2 text-violet-300 hover:text-white bg-violet-900/30 hover:bg-violet-600 border border-violet-500/30 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)] opacity-90 group-hover:opacity-100"
                      >
                        <Search size={16} />
                        Abrir Taller
                      </Link>
                    </td>
                  </tr>
                )
              })}
              
              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="bg-black/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/20 shadow-inner">
                      <Calendar className="h-10 w-10 text-violet-400/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">No hay turnos registrados</h3>
                    <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">Cuando crees un nuevo ingreso de un cliente, aparecerá en esta lista.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
