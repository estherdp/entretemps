import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdventureDetailPage from '@/app/my-adventures/[id]/page'
import { RepositoryProvider } from '@/ui/providers/repository-provider'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockParams = { id: 'test-pack-id' }

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockParams,
}))

// Mock Supabase auth
vi.mock('@/infrastructure/services/auth-service', () => ({
  createAuthService: vi.fn(() => ({
    getCurrentUser: vi.fn().mockResolvedValue({ id: 'user-123', email: 'test@test.com' }),
  })),
  SupabaseAuthService: vi.fn().mockImplementation(() => ({
    getCurrentUser: vi.fn().mockResolvedValue({ id: 'user-123', email: 'test@test.com' }),
  })),
}))

// Mock repository
const mockGetById = vi.fn()
const mockUpdatePackJson = vi.fn()

vi.mock('@/infrastructure/supabase/adventure-pack-repository', () => {
  // Necesitamos exportar una clase real, no solo una función
  class MockAdventurePackRepository {
    getById = mockGetById
    updatePackJson = mockUpdatePackJson
  }
  
  return {
    AdventurePackRepository: MockAdventurePackRepository
  }
})

// Helper to render with providers
function renderWithProviders(component: React.ReactElement) {
  return render(
    <RepositoryProvider>
      {component}
    </RepositoryProvider>
  )
}

describe('AdventureDetailPage - Edit Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    const mockPack = {
      id: 'test-pack-id',
      userId: 'user-123',
      title: 'Test Adventure',
      pack: {
        id: 'pack-123',
        title: 'Test Adventure',
        image: { url: '', prompt: '' },
        estimatedDurationMinutes: 60,
        ageRange: { min: 6, max: 10 },
        participants: 5,
        difficulty: 'medium',
        tone: 'funny',
        adventureType: 'mystery',
        place: 'home',
        materials: ['Papel'],
        introduction: {
          story: 'Original intro story',
          setupForParents: 'Original setup',
        },
        missions: [
          {
            order: 1,
            title: 'Mission 1',
            story: 'Original mission story',
            parentGuide: 'Guide',
            successCondition: 'Complete',
          },
        ],
        conclusion: {
          story: 'Original conclusion story',
          celebrationTip: 'Celebrate!',
        },
        createdAt: '2024-01-01T00:00:00Z',
      },
      createdAt: '2024-01-01T00:00:00Z',
    }

    mockGetById.mockResolvedValue(mockPack)
  })

  it('should show textarea when edit mode is activated', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdventureDetailPage />)

    // Wait for pack to load
    await waitFor(() => {
      expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    })

    // Initially, text should be shown as paragraph, not textarea
    expect(screen.getByText('Original intro story')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Historia de introducción...')).not.toBeInTheDocument()

    // Click edit button
    const editButton = screen.getByRole('button', { name: /editar aventura/i })
    await user.click(editButton)

    // After clicking edit, inputs and textareas should appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título de la aventura...')).toBeInTheDocument()
    })

    // Verify title input contains original value
    const titleInput = screen.getByPlaceholderText('Título de la aventura...')
    expect(titleInput).toHaveValue('Test Adventure')

    // Verify image URL input appears
    expect(screen.getByPlaceholderText('https://ejemplo.com/imagen.jpg')).toBeInTheDocument()

    // Verify textarea contains original value
    const introTextarea = screen.getByPlaceholderText('Historia de introducción...')
    expect(introTextarea).toHaveValue('Original intro story')

    // Expand the mission accordion first
    const expandButton = screen.getByLabelText('Expandir')
    await user.click(expandButton)

    // Wait for the accordion to expand
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Historia de la misión 1...')).toBeInTheDocument()
    })

    // Verify conclusion textarea appears
    expect(screen.getByPlaceholderText('Historia de conclusión...')).toBeInTheDocument()

    // Verify save/cancel buttons appear
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('should hide edit button when in edit mode', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdventureDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /editar aventura/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /editar aventura/i })).not.toBeInTheDocument()
    })
  })

  it('should restore original values when cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdventureDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    })

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /editar aventura/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Historia de introducción...')).toBeInTheDocument()
    })

    // Modify title and text
    const titleInput = screen.getByPlaceholderText('Título de la aventura...')
    await user.clear(titleInput)
    await user.type(titleInput, 'Modified Title')

    const introTextarea = screen.getByPlaceholderText('Historia de introducción...')
    await user.clear(introTextarea)
    await user.type(introTextarea, 'Modified story')

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    // Should exit edit mode and show original text
    await waitFor(() => {
      expect(screen.getByText('Test Adventure')).toBeInTheDocument()
      expect(screen.getByText('Original intro story')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Historia de introducción...')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Título de la aventura...')).not.toBeInTheDocument()
    })
  })

  it('should allow editing title and image URL', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdventureDetailPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Adventure')).toBeInTheDocument()
    })

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /editar aventura/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Título de la aventura...')).toBeInTheDocument()
    })

    // Verify title is editable
    const titleInput = screen.getByPlaceholderText('Título de la aventura...')
    expect(titleInput).toHaveValue('Test Adventure')
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title')
    expect(titleInput).toHaveValue('New Title')

    // Verify image URL is editable
    const imageInput = screen.getByPlaceholderText('https://ejemplo.com/imagen.jpg')
    await user.type(imageInput, 'https://new-image.com/test.jpg')
    expect(imageInput).toHaveValue('https://new-image.com/test.jpg')
  })
})
