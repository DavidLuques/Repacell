'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { saveImageRecord } from '@/app/dashboard/reparacion/[id]/actions'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, UploadCloud } from 'lucide-react'

export default function ImageUploader({ repairId, images = [] }) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      // 1. Subir a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${repairId}_${Date.now()}.${fileExt}`
      const filePath = `reparaciones/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('repairs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('repairs')
        .getPublicUrl(filePath)

      // 3. Guardar en Base de Datos
      await saveImageRecord(repairId, publicUrl, type)
      
      router.refresh()
    } catch (error) {
      alert('Error al subir imagen: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
        <Camera className="text-blue-600" /> 
        Evidencia Fotográfica
      </h3>
      
      <div className="space-y-6">
        {/* Uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
            {uploading ? (
              <Loader2 className="animate-spin text-blue-500 mb-2" />
            ) : (
              <UploadCloud className="text-gray-400 group-hover:text-blue-500 mb-2" />
            )}
            <span className="text-sm font-medium text-gray-700">Foto del Ingreso</span>
            <span className="text-xs text-gray-500 mt-1">Placa o equipo dañado</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'ingreso')} disabled={uploading} />
          </label>

          <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
            {uploading ? (
              <Loader2 className="animate-spin text-blue-500 mb-2" />
            ) : (
              <UploadCloud className="text-gray-400 group-hover:text-blue-500 mb-2" />
            )}
            <span className="text-sm font-medium text-gray-700">Foto del Trabajo Final</span>
            <span className="text-xs text-gray-500 mt-1">Equipo reparado y armado</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'final')} disabled={uploading} />
          </label>
        </div>

        {/* Galería */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Galería del Equipo</h4>
            <div className="grid grid-cols-2 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md z-10 capitalize">
                    {img.type}
                  </span>
                  <img src={img.image_url} alt="Evidencia" className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
