import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Wrench, CheckCircle, Package, Search } from 'lucide-react'

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Calendar },
  in_progress: { label: 'En Reparación', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Wrench },
  ready: { label: 'Listo p/ Retiro', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Package }
}

const FilterButton = ({ status, label, currentFilter }) => {
  const isActive = currentFilter === status
  return (
    <Link 
      href={`/dashboard${status === 'all' ? '' : `?status=${status}`}`}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Recepción</h1>
          <p className="text-gray-500 mt-1">Gestión general de turnos y equipos en el taller.</p>
        </div>
        <Link 
          href="/dashboard/ingreso" 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg font-medium transition-all"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dispositivo / Falla</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {appointments?.map((apt) => {
                const config = statusConfig[apt.status] || statusConfig.pending
                const Icon = config.icon
                
                return (
                  <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{apt.scheduled_date}</div>
                      <div className="text-sm text-gray-500 font-medium">{apt.scheduled_time.slice(0, 5)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{apt.client_name}</div>
                      <div className="text-sm text-gray-500">{apt.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{apt.device_brand} {apt.device_model}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-sm mt-0.5" title={apt.issue_description}>
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
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-lg transition-all opacity-90 group-hover:opacity-100"
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
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No hay turnos registrados</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">Cuando crees un nuevo ingreso de un cliente, aparecerá en esta lista.</p>
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
