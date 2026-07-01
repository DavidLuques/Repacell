import { render, screen, fireEvent } from '@testing-library/react'
import RepairForm from '@/components/workshop/RepairForm'

// Mock del server action
jest.mock('@/app/dashboard/reparacion/[id]/actions', () => ({
  updateRepairStatus: jest.fn().mockResolvedValue({ success: true })
}))

describe('RepairForm Client Component', () => {
  const mockAppointment = {
    id: 'appt-123',
    status: 'in_progress',
  }

  const mockRepair = {
    id: 'repair-456',
    technician_notes: 'Se reemplazó módulo de pantalla',
    estimated_cost: 120.50
  }

  it('renders preloaded form details correctly', () => {
    const { container } = render(<RepairForm appointment={mockAppointment} repair={mockRepair} />)

    // Ficha Tecnica titulo
    expect(screen.getByText('Ficha Técnica')).toBeInTheDocument()

    // Select pre-seleccionado
    const statusSelect = container.querySelector('select[name="status"]')
    expect(statusSelect).toBeInTheDocument()
    expect(statusSelect.value).toBe('in_progress')

    // Notas de bitácora
    const textarea = container.querySelector('textarea[name="notes"]')
    expect(textarea).toBeInTheDocument()
    expect(textarea.value).toBe('Se reemplazó módulo de pantalla')

    // Costo precargado
    const costInput = container.querySelector('input[name="cost"]')
    expect(costInput).toBeInTheDocument()
    expect(costInput.value).toBe('120.5')
  })

  it('allows changing the status select value', () => {
    const { container } = render(<RepairForm appointment={mockAppointment} repair={mockRepair} />)

    const statusSelect = container.querySelector('select[name="status"]')
    fireEvent.change(statusSelect, { target: { value: 'ready' } })

    expect(statusSelect.value).toBe('ready')
  })

  it('renders hidden inputs for ids', () => {
    const { container } = render(<RepairForm appointment={mockAppointment} repair={mockRepair} />)

    const apptInput = container.querySelector('input[name="appointmentId"]')
    const repairInput = container.querySelector('input[name="repairId"]')

    expect(apptInput).toBeInTheDocument()
    expect(apptInput.value).toBe('appt-123')
    
    expect(repairInput).toBeInTheDocument()
    expect(repairInput.value).toBe('repair-456')
  })
})
