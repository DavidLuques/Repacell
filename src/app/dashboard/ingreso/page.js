import AppointmentForm from '@/components/forms/AppointmentForm'

export default function IngresoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Ingreso de Equipo</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <AppointmentForm />
      </div>
    </div>
  )
}
