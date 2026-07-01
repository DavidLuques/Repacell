import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AppointmentForm from '@/components/forms/AppointmentForm'

// Mock estático del cliente Supabase para este test
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  then: jest.fn().mockImplementation((onfulfilled) => {
    // Simular que retorna algunos slots por defecto
    return Promise.resolve({ data: [{ start_time: '09:00:00' }, { start_time: '10:00:00' }], error: null }).then(onfulfilled)
  })
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase
}))

describe('AppointmentForm Client Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields correctly', () => {
    const { container } = render(<AppointmentForm />)
    
    expect(container.querySelector('input[name="client_name"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="phone"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="device_brand"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="device_model"]')).toBeInTheDocument()
    expect(container.querySelector('textarea[name="issue_description"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="scheduled_date"]')).toBeInTheDocument()
    expect(container.querySelector('select[name="scheduled_time"]')).toBeInTheDocument()
  })

  it('shows zod validation errors when trying to submit empty fields', async () => {
    render(<AppointmentForm />)
    
    const submitBtn = screen.getByRole('button', { name: /Crear Turno de Ingreso/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
      expect(screen.getByText('Teléfono inválido')).toBeInTheDocument()
      expect(screen.getByText('Marca requerida')).toBeInTheDocument()
      expect(screen.getByText('Modelo requerido')).toBeInTheDocument()
      expect(screen.getByText('Describe el problema con más detalle (mín. 10 caracteres)')).toBeInTheDocument()
    })
  })

  it('select slot is disabled initially and enabled when date is picked', async () => {
    const { container } = render(<AppointmentForm />)
    
    const selectSlot = container.querySelector('select[name="scheduled_time"]')
    expect(selectSlot).toBeDisabled()

    const dateInput = container.querySelector('input[name="scheduled_date"]')
    fireEvent.change(dateInput, { target: { value: '2026-07-02' } })

    await waitFor(() => {
      expect(selectSlot).not.toBeDisabled()
    })
  })
})
