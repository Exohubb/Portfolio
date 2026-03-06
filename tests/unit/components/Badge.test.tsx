import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/atoms/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Featured</Badge>)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders dot when dot=true', () => {
    const { container } = render(<Badge dot>Active</Badge>)
    expect(container.querySelector('span span')).toBeInTheDocument()
  })

  it('applies accent variant', () => {
    render(<Badge variant="accent">Accent</Badge>)
    expect(screen.getByText('Accent')).toHaveClass('text-accent')
  })
})
