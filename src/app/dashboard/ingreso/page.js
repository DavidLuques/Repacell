import AppointmentForm from '@/components/forms/AppointmentForm'

export default function IngresoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Nuevo Ingreso de Equipo</h1>
        <p className="text-violet-200/60 mt-2">Registra los datos del cliente y el dispositivo a reparar.</p>
      </div>
      <div className="bg-transparent">
        <AppointmentForm />
      </div>
    </div>
  )
}
