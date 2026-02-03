import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConditionalNavbarWrapper } from '@/ui/components/conditional-navbar-wrapper'

// Mock the navbar component
vi.mock('@/ui/components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar Component</div>,
}))

// Mock next/navigation
const mockPathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('ConditionalNavbarWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Navbar visibility', () => {
    it('should show navbar on home page', () => {
      mockPathname.mockReturnValue('/')

      render(
        <ConditionalNavbarWrapper>
          <div>Page Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Page Content')).toBeInTheDocument()
    })

    it('should show navbar on login page', () => {
      mockPathname.mockReturnValue('/login')

      render(
        <ConditionalNavbarWrapper>
          <div>Login Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Login Content')).toBeInTheDocument()
    })

    it('should show navbar on my-adventures page', () => {
      mockPathname.mockReturnValue('/my-adventures')

      render(
        <ConditionalNavbarWrapper>
          <div>My Adventures Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('My Adventures Content')).toBeInTheDocument()
    })

    it('should show navbar on specific adventure detail page', () => {
      mockPathname.mockReturnValue('/my-adventures/123')

      render(
        <ConditionalNavbarWrapper>
          <div>Adventure Detail Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Adventure Detail Content')).toBeInTheDocument()
    })

    it('should show navbar on wizard pages', () => {
      mockPathname.mockReturnValue('/wizard/step-1')

      render(
        <ConditionalNavbarWrapper>
          <div>Wizard Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Wizard Content')).toBeInTheDocument()
    })
  })

  describe('Navbar hidden on auth callback', () => {
    it('should hide navbar on auth callback page', () => {
      mockPathname.mockReturnValue('/auth/callback')

      render(
        <ConditionalNavbarWrapper>
          <div>Auth Callback Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()
      expect(screen.getByText('Auth Callback Content')).toBeInTheDocument()
    })

    it('should hide navbar on auth callback with query params', () => {
      mockPathname.mockReturnValue('/auth/callback?code=abc123')

      render(
        <ConditionalNavbarWrapper>
          <div>Auth Callback Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()
      expect(screen.getByText('Auth Callback Content')).toBeInTheDocument()
    })

    it('should hide navbar on any auth callback sub-path', () => {
      mockPathname.mockReturnValue('/auth/callback/verify')

      render(
        <ConditionalNavbarWrapper>
          <div>Auth Verify Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()
      expect(screen.getByText('Auth Verify Content')).toBeInTheDocument()
    })
  })

  describe('Children rendering', () => {
    it('should always render children regardless of navbar visibility', () => {
      // Test with navbar visible
      mockPathname.mockReturnValue('/')
      const { rerender } = render(
        <ConditionalNavbarWrapper>
          <div>Test Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()

      // Test with navbar hidden
      mockPathname.mockReturnValue('/auth/callback')
      rerender(
        <ConditionalNavbarWrapper>
          <div>Test Content</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render multiple children correctly', () => {
      mockPathname.mockReturnValue('/')

      render(
        <ConditionalNavbarWrapper>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByText('First Child')).toBeInTheDocument()
      expect(screen.getByText('Second Child')).toBeInTheDocument()
      expect(screen.getByText('Third Child')).toBeInTheDocument()
    })

    it('should render complex child components', () => {
      mockPathname.mockReturnValue('/')

      const ComplexChild = () => (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      )

      render(
        <ConditionalNavbarWrapper>
          <ComplexChild />
        </ConditionalNavbarWrapper>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Button')).toBeInTheDocument()
    })
  })
})
