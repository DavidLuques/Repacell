# Repacell Architecture

## Objetivo
Repacell es una app web para gestionar reparaciones de celulares. Hoy está enfocada en autenticación, acceso al dashboard y base visual del sistema.

## Tecnologías usadas
- Next.js 16 con App Router
- React 19
- JavaScript
- Supabase para autenticación y sesión
- `@supabase/ssr` para clientes server-side y manejo de cookies
- Tailwind CSS 4 para estilos
- ESLint 9 para calidad de código
- `next/font` con Geist y Geist Mono

## Arquitectura actual
- La ruta principal redirige a `/dashboard`.
- La pantalla `/login` muestra el formulario de acceso técnico.
- El archivo `src/app/login/actions.js` hace login y logout con Supabase.
- `middleware.js` protege rutas privadas y mantiene la sesión sincronizada.
- `src/app/dashboard/layout.js` arma el layout principal con sidebar y sesión del usuario.
- `src/app/dashboard/page.js` todavía es una vista base, pensada para crecer.

## Flujo actual
1. El usuario entra al sitio.
2. Si no está autenticado, el middleware lo lleva a `/login`.
3. Si inicia sesión correctamente, Supabase crea la sesión.
4. La app lo redirige a `/dashboard`.
5. El layout del dashboard lee el usuario desde Supabase y muestra su email.

## Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tecnologías por utilizar
- Modelo de datos para reparaciones, clientes y estados de trabajo
- Formularios de alta de ingreso técnico
- Listado interactivo de reparaciones
- Búsqueda, filtros y ordenamiento
- Edición de estados de reparación
- Posible carga de fotos o archivos del equipo
- Posibles roles de usuario si el sistema crece

