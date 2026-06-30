import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Smartphone, AlertTriangle } from 'lucide-react'
import RepairForm from '@/components/workshop/RepairForm'
import ImageUploader from '@/components/workshop/ImageUploader'

export default async function ReparacionPage({ params }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  const supabase = await createClient()

  // Traer el turno y sus reparaciones
  const { data: appointment } = await supabase
    .from('appointments')
    .select(`
      *,
      repairs (
        *,
        repair_images (*)
      )
    `)
    .eq('id', id)
    .single()

  if (!appointment) notFound()

  // Si no existe el registro de "repair" (porque apenas ingresó), lo creamos On-The-Fly.
  let repair = appointment.repairs?.[0]
  if (!repair) {
    const { data: newRepair } = await supabase
      .from('repairs')
      .insert([{ appointment_id: id }])
      .select()
      .single()
    repair = newRepair
  }

  // Las imagenes asociadas a esta reparación
  const images = repair?.repair_images || []

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Back */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/dashboard" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Taller: Reparación #{(appointment.id).split('-')[0]}</h1>
          <p className="text-gray-500 text-sm">Ingresado el {appointment.scheduled_date} a las {appointment.scheduled_time}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Detalles estáticos */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <User size={16} /> Detalles del Cliente
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Nombre Completo</p>
                <p className="font-medium text-gray-900">{appointment.client_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Teléfono</p>
                <p className="font-medium text-gray-900">{appointment.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <Smartphone size={16} /> Dispositivo
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Marca y Modelo</p>
                <p className="font-medium text-gray-900">{appointment.device_brand} {appointment.device_model}</p>
              </div>
              <div className="pt-2">
                <h4 className="text-xs text-red-400 flex items-center gap-1 font-bold mb-1">
                  <AlertTriangle size={14} /> Falla Reportada (Ingreso)
                </h4>
                <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                  "{appointment.issue_description}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Interacciones del Técnico */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formulario principal de estado y bitácora */}
          <RepairForm appointment={appointment} repair={repair} />
          
          {/* Subida de Fotos (Storage) */}
          <ImageUploader repairId={repair.id} images={images} />
        </div>

      </div>
    </div>
  )
}
