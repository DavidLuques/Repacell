import { login } from './actions'

export default async function LoginPage({ searchParams }) {
  // Await searchParams in Next 15+
  const awaitedSearchParams = await searchParams;
  const hasError = awaitedSearchParams?.error === 'true';

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/40 backdrop-blur-md rounded-xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] relative overflow-hidden">
        {/* Adorno brillante superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-sm tracking-tight">Repacell</h1>
          <h2 className="mt-2 text-sm tracking-widest uppercase font-semibold text-violet-300/80">Acceso Técnico</h2>
        </div>
        
        {hasError && (
          <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg backdrop-blur-sm">
            Credenciales inválidas. Por favor intente nuevamente.
          </div>
        )}

        <form className="space-y-5 mt-4" action={login}>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="tecnico@repacell.com"
              required 
              className="w-full px-4 py-2.5 bg-white/95 text-black placeholder-gray-500 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner font-medium transition-all" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-2.5 bg-white/95 text-black placeholder-gray-500 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner font-medium transition-all" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 mt-4 font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all uppercase tracking-wider text-sm"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  )
}
