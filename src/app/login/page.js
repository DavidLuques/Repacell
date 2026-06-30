import { login } from './actions'

export default async function LoginPage({ searchParams }) {
  // Await searchParams in Next 15+
  const awaitedSearchParams = await searchParams;
  const hasError = awaitedSearchParams?.error === 'true';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Repacell</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">Acceso Técnico</h2>
        </div>
        
        {hasError && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
            Credenciales inválidas. Por favor intente nuevamente.
          </div>
        )}

        <form className="space-y-4" action={login}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="tecnico@repacell.com"
              required 
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  )
}
