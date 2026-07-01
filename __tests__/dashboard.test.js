import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server')

describe('DashboardPage Server Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no appointments are returned', async () => {
    const mockQuery = {
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((onfulfilled) => {
        return Promise.resolve({ data: [], error: null }).then(onfulfilled)
      })
    }

    createClient.mockResolvedValue({
      from: () => ({
        select: () => mockQuery
      })
    })

    const ResolvedPage = await DashboardPage({ searchParams: Promise.resolve({}) })
    render(ResolvedPage)

    expect(screen.getByText('Panel de Recepción')).toBeInTheDocument()
    expect(screen.getByText('No hay turnos registrados')).toBeInTheDocument()
    expect(screen.getByText(/Todos los turnos/i)).toBeInTheDocument()
  })

  it('renders a list of appointments', async () => {
    const mockAppointments = [
      {
        id: '123-abc',
        scheduled_date: '2026-07-02',
        scheduled_time: '14:00:00',
        client_name: 'Juan Perez',
        phone: '123456789',
        device_brand: 'Motorola',
        device_model: 'G100',
        issue_description: 'Pantalla rota',
        status: 'pending'
      }
    ]

    const mockQuery = {
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((onfulfilled) => {
        return Promise.resolve({ data: mockAppointments, error: null }).then(onfulfilled)
      })
    }

    createClient.mockResolvedValue({
      from: () => ({
        select: () => mockQuery
      })
    })

    const ResolvedPage = await DashboardPage({ searchParams: Promise.resolve({ status: 'pending' }) })
    render(ResolvedPage)

    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('Motorola G100')).toBeInTheDocument()
    expect(screen.getByText('Pantalla rota')).toBeInTheDocument()
  })
})
