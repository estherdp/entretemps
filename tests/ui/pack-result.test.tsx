import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PackResultPage from '@/app/pack/result/page'
import { RepositoryProvider } from '@/ui/providers/repository-provider'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

vi.mock('@/infrastructure/services/auth-service', () => ({
  createAuthService: vi.fn(() => ({
    getCurrentUser: vi.fn().mockResolvedValue(null),
  })),
  SupabaseAuthService: vi.fn().mockImplementation(() => ({
    getCurrentUser: vi.fn().mockResolvedValue(null),
  })),
}))

vi.mock('@/infrastructure/supabase/adventure-pack-repository', () => ({
  AdventurePackRepository: vi.fn(),
}))

vi.mock('@/application/save-adventure-pack', () => ({
  saveAdventurePack: vi.fn(),
}))

// Helper to render with providers
function renderWithProviders(component: React.ReactElement) {
  return render(
    <RepositoryProvider>
      {component}
    </RepositoryProvider>
  )
}

const mockPack: GeneratedAdventurePack = {
  id: 'pack-123',
  title: 'La Aventura de los Dinosaurios',
  image: {
    url: 'https://example.com/image.jpg',
    prompt: 'Dinosaur adventure',
  },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 8,
  difficulty: 'easy',
  tone: 'funny',
  adventureType: 'mystery',
  place: 'home',
  materials: ['Papel', 'Lápices', 'Tijeras'],
  introduction: {
    story: 'Érase una vez, en un mundo lleno de dinosaurios...',
    setupForParents: 'Preparar el espacio con las pistas escondidas.',
  },
  missions: [
    {
      order: 1,
      title: 'Descubrir el primer fósil',
      story: 'Los niños deben encontrar el primer fósil escondido.',
      parentGuide: 'Esconde el fósil en un lugar visible pero no obvio.',
      successCondition: 'Encuentran el fósil y lo presentan al grupo.',
    },
    {
      order: 2,
      title: 'Resolver el enigma',
      story: 'Con el fósil encontrado, deben resolver un enigma.',
      parentGuide: 'Lee el enigma en voz alta si tienen dificultades.',
      successCondition: 'Resuelven el enigma correctamente.',
    },
  ],
  conclusion: {
    story: 'Y así, los valientes exploradores completaron su misión.',
    celebrationTip: 'Celebrad con una fiesta de dinosaurios y diplomas.',
  },
  createdAt: '2024-01-15T10:30:00.000Z',
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('PackResultPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should show error message when no pack in storage', async () => {
    renderWithProviders(<PackResultPage />)

    await screen.findByText('No se encontró ninguna aventura generada.')
    expect(screen.getByText('Crear nueva aventura')).toBeInTheDocument()
  })

  it('should display pack title when pack is loaded', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('La Aventura de los Dinosaurios')
  })

  it('should display key information correctly', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('La Aventura de los Dinosaurios')
    // Valores numéricos divididos en elementos separados (número + etiqueta en <span>)
    expect(screen.getByText('Edades')).toBeInTheDocument()
    expect(screen.getByText('Duración')).toBeInTheDocument()
    expect(screen.getByText('Participantes')).toBeInTheDocument()
    expect(screen.getByText('Fácil')).toBeInTheDocument()
  })

  it('should display introduction story', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('Érase una vez, en un mundo lleno de dinosaurios...')
  })

  it('should display all materials', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('Papel')
    expect(screen.getByText('Lápices')).toBeInTheDocument()
    expect(screen.getByText('Tijeras')).toBeInTheDocument()
  })

  it('should display missions in correct order', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('Descubrir el primer fósil')
    expect(screen.getByText('Resolver el enigma')).toBeInTheDocument()
  })

  it('should display mission details', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('Los niños deben encontrar el primer fósil escondido.')
    expect(screen.getByText('Esconde el fósil en un lugar visible pero no obvio.')).toBeInTheDocument()
    expect(screen.getByText(/Encuentran el fósil y lo presentan al grupo./)).toBeInTheDocument()
  })

  it('should display conclusion', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('Y así, los valientes exploradores completaron su misión.')
    expect(screen.getByText('Celebrad con una fiesta de dinosaurios y diplomas.')).toBeInTheDocument()
  })

  it('should display action buttons', async () => {
    sessionStorage.setItem('generated-adventure-pack', JSON.stringify(mockPack))

    renderWithProviders(<PackResultPage />)

    await screen.findByText('La Aventura de los Dinosaurios')
    expect(screen.getByRole('button', { name: 'Nueva aventura' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Imprimir' })).toBeInTheDocument()
  })
})
