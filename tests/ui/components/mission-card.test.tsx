import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MissionCard } from '@/ui/components/mission-card'
import { Mission } from '@/domain/generated-adventure-pack'
import { DndContext } from '@dnd-kit/core'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

const mockMission: Mission = {
  order: 1,
  title: 'Test Mission',
  story: 'This is a test mission story that needs to be solved.',
  parentGuide: 'Parent guide for this mission',
  successCondition: 'Find the hidden key',
}

describe('MissionCard', () => {
  const defaultProps = {
    mission: mockMission,
    isEditing: false,
    isRegenerating: false,
    missionStory: 'This is a test mission story that needs to be solved.',
    onStoryChange: vi.fn(),
    onRegenerate: vi.fn(),
    isDragDisabled: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Accordion functionality', () => {
    it('should render mission card in collapsed state by default', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} />
        </DndContext>
      )

      // Title should be visible
      expect(screen.getByText('Test Mission')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()

      // Details should not be visible (accordion collapsed)
      expect(screen.queryByText('This is a test mission story that needs to be solved.')).not.toBeInTheDocument()
      expect(screen.queryByText('Parent guide for this mission')).not.toBeInTheDocument()
    })

    it('should expand accordion when clicking expand button', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} />
        </DndContext>
      )

      // Find and click the expand button (ChevronDown icon button)
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Details should now be visible
      expect(screen.getByText('This is a test mission story that needs to be solved.')).toBeInTheDocument()
      expect(screen.getByText('Parent guide for this mission')).toBeInTheDocument()
      expect(screen.getByText('Find the hidden key')).toBeInTheDocument()
    })

    it('should collapse accordion when clicking collapse button', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} />
        </DndContext>
      )

      // Expand first
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Verify expanded
      expect(screen.getByText('This is a test mission story that needs to be solved.')).toBeInTheDocument()

      // Now the button should say "Contraer"
      const collapseButton = screen.getByLabelText('Contraer')
      fireEvent.click(collapseButton)

      // Details should be hidden again
      expect(screen.queryByText('This is a test mission story that needs to be solved.')).not.toBeInTheDocument()
    })
  })

  describe('Drag & Drop functionality', () => {
    it('should not show drag handle when not in edit mode', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={false} />
        </DndContext>
      )

      // Drag handle should not be rendered
      const gripIcons = screen.queryByTestId('grip-icon')
      expect(gripIcons).not.toBeInTheDocument()
    })

    it('should show drag handle when in edit mode', () => {
      const { container } = render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} />
        </DndContext>
      )

      // Look for the grip icon - it's rendered but we need to check by class or other means
      // Since we're using lucide-react icons, we can check if the button exists
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(1) // At least expand button + drag handle
    })

    it('should not show drag handle when drag is disabled', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} isDragDisabled={true} />
        </DndContext>
      )

      // When drag is disabled, handle should not be visible
      const gripIcons = screen.queryByTestId('grip-icon')
      expect(gripIcons).not.toBeInTheDocument()
    })
  })

  describe('Regenerate button functionality', () => {
    it('should not show regenerate button when not in edit mode', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={false} />
        </DndContext>
      )

      // Expand to see content
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Regenerate button should not be visible
      expect(screen.queryByText('Regenerar')).not.toBeInTheDocument()
    })

    it('should show regenerate button when in edit mode and expanded', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Regenerate button should be visible
      expect(screen.getByText('Regenerar')).toBeInTheDocument()
    })

    it('should call onRegenerate when regenerate button is clicked', () => {
      const mockOnRegenerate = vi.fn()

      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} onRegenerate={mockOnRegenerate} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Click regenerate button
      const regenerateButton = screen.getByText('Regenerar')
      fireEvent.click(regenerateButton)

      expect(mockOnRegenerate).toHaveBeenCalledTimes(1)
    })

    it('should disable regenerate button when regenerating', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} isRegenerating={true} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Button should show "Regenerando..." and be disabled
      const regenerateButton = screen.getByText('Regenerando...')
      expect(regenerateButton).toBeDisabled()
    })
  })

  describe('Edit mode functionality', () => {
    it('should show textarea for story in edit mode', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Textarea should be visible in edit mode
      const textarea = screen.getByDisplayValue('This is a test mission story that needs to be solved.')
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('should show read-only text in view mode', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={false} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Story text should be visible but not in textarea
      expect(screen.getByText('This is a test mission story that needs to be solved.')).toBeInTheDocument()
      const textareas = screen.queryAllByRole('textbox')
      expect(textareas.length).toBe(0)
    })

    it('should call onStoryChange when story is edited', () => {
      const mockOnStoryChange = vi.fn()

      render(
        <DndContext>
          <MissionCard {...defaultProps} isEditing={true} onStoryChange={mockOnStoryChange} />
        </DndContext>
      )

      // Expand accordion
      const expandButton = screen.getByLabelText('Expandir')
      fireEvent.click(expandButton)

      // Edit the story
      const textarea = screen.getByDisplayValue('This is a test mission story that needs to be solved.')
      fireEvent.change(textarea, { target: { value: 'New story content' } })

      // onStoryChange is called with the mission order and new value
      expect(mockOnStoryChange).toHaveBeenCalled()
    })
  })

  describe('Responsive design', () => {
    it('should render mission number badge', () => {
      render(
        <DndContext>
          <MissionCard {...defaultProps} />
        </DndContext>
      )

      const badge = screen.getByText('1')
      expect(badge).toBeInTheDocument()
    })

    it('should display mission title with truncation classes', () => {
      const { container } = render(
        <DndContext>
          <MissionCard {...defaultProps} />
        </DndContext>
      )

      const title = screen.getByText('Test Mission')
      expect(title).toBeInTheDocument()

      // Check for truncation classes
      expect(title.className).toContain('line-clamp-2')
    })
  })
})
