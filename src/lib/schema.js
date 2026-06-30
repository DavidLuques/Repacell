import { z } from 'zod';

export const appointmentSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(8, 'Teléfono inválido'),
  device_brand: z.string().min(2, 'Marca requerida'),
  device_model: z.string().min(2, 'Modelo requerido'),
  issue_description: z.string().min(10, 'Describe el problema con más detalle (mín. 10 caracteres)'),
  scheduled_date: z.string().min(1, 'Selecciona una fecha'),
  scheduled_time: z.string().min(1, 'Selecciona un horario'),
});
