import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the useHomeData hook
const mockUseHomeData = vi.fn()
vi.mock('@/ui/hooks/use-home-data', () => ({
  useHomeData: () => mockUseHomeData(),
}))

// Mock the AdventureCard component
vi.mock('@/ui/components/adventure-card', () => ({
  AdventureCard: ({ title }: { title: string }) => <div data-testid="adventure-card">{title}</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Sparkles: () => <div>Sparkles Icon</div>,
  Users: () => <div>Users Icon</div>,
  Wand2: () => <div>Wand2 Icon</div>,
  BookOpen: () => <div>BookOpen Icon</div>,
}))

const mockTemplates = [
  {
    id: 'template-1',
    title: 'Template Adventure 1',
    ageRange: { min: 5, max: 10 },
    estimatedDurationMinutes: 60,
    image: { url: 'https://example.com/image1.jpg', prompt: 'test' },
  },
  {
    id: 'template-2',
    title: 'Template Adventure 2',
    ageRange: { min: 8, max: 12 },
    estimatedDurationMinutes: 90,
    image: { url: 'https://example.com/image2.jpg', prompt: 'test' },
  },
]

const mockMyAdventures = [
  {
    id: 'adventure-1',
    title: 'My Adventure 1',
    pack: {
      ageRange: { min: 6, max: 10 },
      estimatedDurationMinutes: 45,
      image: { url: 'https://example.com/my-image1.jpg', prompt: 'test' },
    },
  },
]

describe('Home Page - Conditional Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Non-authenticated user (Landing Page)', () => {
    beforeEach(() => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: [],
          myAdventures: [],
          hasUser: false,
        },
        isLoading: false,
      })
    })

    it('should show landing page hero with Entretemps title', () => {
      render(<Home />)

      expect(screen.getByText('Entretemps')).toBeInTheDocument()
      expect(screen.getByText('Aventuras infantiles personalizadas con IA')).toBeInTheDocument()
    })

    it('should show landing page description', () => {
      render(<Home />)

      expect(
        screen.getByText(/Crea experiencias tipo escape room únicas para niños/i)
      ).toBeInTheDocument()
    })

    it('should show login and register buttons', () => {
      render(<Home />)

      const buttons = screen.getAllByText(/iniciar sesión|registrarse/i)
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('should show features section with 4 feature cards', () => {
      render(<Home />)

      expect(screen.getByText('¿Qué puedes hacer con Entretemps?')).toBeInTheDocument()
      expect(screen.getByText('Generación con IA')).toBeInTheDocument()
      expect(screen.getByText('Personalización')).toBeInTheDocument()
      expect(screen.getByText('Edición Human-in-the-Loop')).toBeInTheDocument()
      expect(screen.getByText('Guías para Padres')).toBeInTheDocument()
    })

    it('should show CTA section', () => {
      render(<Home />)

      expect(screen.getByText('¿Listo para crear tu primera aventura?')).toBeInTheDocument()
      expect(screen.getByText('Comenzar Ahora')).toBeInTheDocument()
    })

    it('should NOT show "Nueva aventura" button', () => {
      render(<Home />)

      // The "Nueva aventura" button with sparkle emoji should not be visible
      const newAdventureButtons = screen.queryAllByText(/✨ Crear nueva aventura/i)
      expect(newAdventureButtons.length).toBe(0)
    })

    it('should NOT show "Mis Aventuras" section', () => {
      render(<Home />)

      expect(screen.queryByText('Mis Aventuras')).not.toBeInTheDocument()
      expect(screen.queryByText('Tus creaciones guardadas')).not.toBeInTheDocument()
    })

    it('should NOT show "Plantillas" section', () => {
      render(<Home />)

      expect(screen.queryByText('Plantillas')).not.toBeInTheDocument()
      expect(screen.queryByText('Aventuras listas para jugar')).not.toBeInTheDocument()
    })
  })

  describe('Authenticated user (Home Dashboard)', () => {
    beforeEach(() => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: mockTemplates,
          myAdventures: mockMyAdventures,
          hasUser: true,
        },
        isLoading: false,
      })
    })

    it('should show authenticated user welcome message', () => {
      render(<Home />)

      expect(screen.getByText('Bienvenido a Entretemps')).toBeInTheDocument()
    })

    it('should show "Crear nueva aventura" button', () => {
      render(<Home />)

      expect(screen.getByText(/✨ Crear nueva aventura/i)).toBeInTheDocument()
    })

    it('should show "Mis Aventuras" section', () => {
      render(<Home />)

      expect(screen.getByText('Mis Aventuras')).toBeInTheDocument()
      expect(screen.getByText('Tus creaciones guardadas')).toBeInTheDocument()
    })

    it('should render user adventures in "Mis Aventuras" section', () => {
      render(<Home />)

      expect(screen.getByText('My Adventure 1')).toBeInTheDocument()
    })

    it('should show "Plantillas" section', () => {
      render(<Home />)

      expect(screen.getByText('Plantillas')).toBeInTheDocument()
      expect(screen.getByText('Aventuras listas para jugar')).toBeInTheDocument()
    })

    it('should render templates', () => {
      render(<Home />)

      expect(screen.getByText('Template Adventure 1')).toBeInTheDocument()
      expect(screen.getByText('Template Adventure 2')).toBeInTheDocument()
    })

    it('should NOT show landing page features section', () => {
      render(<Home />)

      expect(screen.queryByText('¿Qué puedes hacer con Entretemps?')).not.toBeInTheDocument()
      expect(screen.queryByText('Generación con IA')).not.toBeInTheDocument()
    })

    it('should NOT show landing page CTA', () => {
      render(<Home />)

      expect(screen.queryByText('¿Listo para crear tu primera aventura?')).not.toBeInTheDocument()
      expect(screen.queryByText('Comenzar Ahora')).not.toBeInTheDocument()
    })

    it('should NOT show "Iniciar Sesión" or "Registrarse" buttons in hero', () => {
      render(<Home />)

      // Check that login/register buttons from landing page are not present
      const allButtons = screen.getAllByRole('button')
      const loginButtons = allButtons.filter(btn =>
        btn.textContent?.includes('Iniciar Sesión') ||
        btn.textContent?.includes('Registrarse')
      )
      expect(loginButtons.length).toBe(0)
    })
  })

  describe('Authenticated user - Empty state', () => {
    beforeEach(() => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: mockTemplates,
          myAdventures: [],
          hasUser: true,
        },
        isLoading: false,
      })
    })

    it('should show empty state message when user has no adventures', () => {
      render(<Home />)

      expect(screen.getByText('Aún no has creado ninguna aventura.')).toBeInTheDocument()
      expect(screen.getByText('Crear tu primera aventura')).toBeInTheDocument()
    })

    it('should still show templates when user has no adventures', () => {
      render(<Home />)

      expect(screen.getByText('Plantillas')).toBeInTheDocument()
      expect(screen.getByText('Template Adventure 1')).toBeInTheDocument()
      expect(screen.getByText('Template Adventure 2')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should show loading message while fetching data', () => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: [],
          myAdventures: [],
          hasUser: true,
        },
        isLoading: true,
      })

      render(<Home />)

      expect(screen.getByText('Cargando aventuras...')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to wizard when clicking "Crear nueva aventura" button', async () => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: mockTemplates,
          myAdventures: mockMyAdventures,
          hasUser: true,
        },
        isLoading: false,
      })

      render(<Home />)

      const createButton = screen.getByText(/✨ Crear nueva aventura/i)
      createButton.click()

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/wizard/step-1')
      })
    })

    it('should navigate to login when clicking "Iniciar Sesión" on landing page', async () => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: [],
          myAdventures: [],
          hasUser: false,
        },
        isLoading: false,
      })

      render(<Home />)

      const loginButtons = screen.getAllByText('Iniciar Sesión')
      loginButtons[0].click()

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })
})
