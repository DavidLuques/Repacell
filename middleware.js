import { updateSession } from './src/lib/supabase/middleware'

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono)
     * - Extensiones como svg, png, jpg, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
