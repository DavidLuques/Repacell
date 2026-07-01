import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'

describe('LoginPage Server Component', () => {
  it('renders login form correctly with fields', async () => {
    const ResolvedPage = await LoginPage({ searchParams: Promise.resolve({}) })
    render(ResolvedPage)
    
    // Titulo y Subtitulo
    expect(screen.getByText('Repacell')).toBeInTheDocument()
    expect(screen.getByText('Acceso Técnico')).toBeInTheDocument()
    
    // Campos del formulario
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tecnico@repacell.com')).toBeInTheDocument()
    
    // Boton de envio
    expect(screen.getByRole('button', { name: /Entrar al Sistema/i })).toBeInTheDocument()
  })

  it('renders error message if searchParams has error=true', async () => {
    const ResolvedPage = await LoginPage({ searchParams: Promise.resolve({ error: 'true' }) })
    render(ResolvedPage)
    
    expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument()
  })
})
