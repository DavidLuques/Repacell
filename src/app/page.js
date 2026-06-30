import { redirect } from 'next/navigation'

export default function Home() {
  // Redirigir siempre a /dashboard, el middleware protege la ruta
  redirect('/dashboard')
}
