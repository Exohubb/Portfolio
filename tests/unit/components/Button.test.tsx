import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/atoms/Button'

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading spinner when loading=true', () => {
    render(<Button loading>Send</Button>)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-accent')
  })

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-accent')
  })
})
