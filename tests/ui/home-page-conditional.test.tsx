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
  Star: () => <div>Star Icon</div>,
  Heart: () => <div>Heart Icon</div>,
  Compass: () => <div>Compass Icon</div>,
  Wand2: () => <div>Wand2 Icon</div>,
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

    it('should show landing page hero with brand badge and tagline', () => {
      render(<Home />)

      expect(screen.getAllByText(/Entretemps/).length).toBeGreaterThan(0)
      expect(screen.getByRole('heading', { name: /La magia de jugar juntos/i })).toBeInTheDocument()
    })

    it('should show landing page description', () => {
      render(<Home />)

      expect(
        screen.getByText(/Crea aventuras épicas para tus hijos en minutos/i)
      ).toBeInTheDocument()
    })

    it('should show CTA buttons', () => {
      render(<Home />)

      expect(screen.getByText('¡Crear mi primera aventura!')).toBeInTheDocument()
      expect(screen.getByText('Ya tengo cuenta')).toBeInTheDocument()
    })

    it('should show features section with 4 feature cards', () => {
      render(<Home />)

      expect(screen.getByText('Todo lo que necesitas para una aventura épica')).toBeInTheDocument()
      expect(screen.getByText('Aventuras únicas en minutos')).toBeInTheDocument()
      expect(screen.getByText('Hecha para tu familia')).toBeInTheDocument()
      expect(screen.getByText('Explora cualquier espacio')).toBeInTheDocument()
      expect(screen.getByText('Tú tienes el control')).toBeInTheDocument()
    })

    it('should show "Para padres, por padres" section', () => {
      render(<Home />)

      expect(screen.getByText('Para padres, por padres')).toBeInTheDocument()
    })

    it('should show CTA section', () => {
      render(<Home />)

      expect(screen.getByText('¿Listo para la primera aventura?')).toBeInTheDocument()
      expect(screen.getByText('¡Vamos allá!')).toBeInTheDocument()
    })

    it('should NOT show "Nueva aventura" button', () => {
      render(<Home />)

      const newAdventureButtons = screen.queryAllByText(/¡Nueva aventura!/i)
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

      expect(screen.getByText(/¡Hola, explorador!/)).toBeInTheDocument()
    })

    it('should show "Nueva aventura" button', () => {
      render(<Home />)

      expect(screen.getByText(/¡Nueva aventura!/i)).toBeInTheDocument()
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

      expect(screen.queryByText('Todo lo que necesitas para una aventura épica')).not.toBeInTheDocument()
      expect(screen.queryByText('Aventuras únicas en minutos')).not.toBeInTheDocument()
    })

    it('should NOT show landing page CTA', () => {
      render(<Home />)

      expect(screen.queryByText('¿Listo para la primera aventura?')).not.toBeInTheDocument()
      expect(screen.queryByText('¡Vamos allá!')).not.toBeInTheDocument()
    })

    it('should NOT show landing page auth buttons in hero', () => {
      render(<Home />)

      const allButtons = screen.getAllByRole('button')
      const landingButtons = allButtons.filter(btn =>
        btn.textContent?.includes('¡Crear mi primera aventura!') ||
        btn.textContent?.includes('Ya tengo cuenta')
      )
      expect(landingButtons.length).toBe(0)
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

      expect(screen.getByText('Buscando tus aventuras...')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to wizard when clicking "Nueva aventura" button', async () => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: mockTemplates,
          myAdventures: mockMyAdventures,
          hasUser: true,
        },
        isLoading: false,
      })

      render(<Home />)

      const createButton = screen.getByText(/¡Nueva aventura!/i)
      createButton.click()

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/wizard/step-1')
      })
    })

    it('should navigate to login when clicking "¡Crear mi primera aventura!" on landing page', async () => {
      mockUseHomeData.mockReturnValue({
        data: {
          templates: [],
          myAdventures: [],
          hasUser: false,
        },
        isLoading: false,
      })

      render(<Home />)

      const ctaButton = screen.getByText('¡Crear mi primera aventura!')
      ctaButton.click()

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })
})
