import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Home Page', () => {
  it('renders the landing page', () => {
    render(<Home />)
    expect(screen.getAllByText(/CondoBI/i).length).toBeGreaterThan(0)
  })

  it('displays the main heading', () => {
    render(<Home />)
    expect(screen.getAllByText(/CondoBI.*SíndicoAI/i).length).toBeGreaterThan(0)
  })

  it('displays the tagline', () => {
    render(<Home />)
    expect(
      screen.getByText(/Apps operacionais cuidam do dia a dia/i)
    ).toBeInTheDocument()
  })

  it('has a link to portal page', () => {
    render(<Home />)
    const portalLinks = screen.getAllByRole('link', { name: /portal/i })
    expect(portalLinks.length).toBeGreaterThan(0)
  })

  it('displays business intelligence features', () => {
    const { container } = render(<Home />)
    const text = container.textContent || ''
    // Look for BI-related terms
    const hasBI = text.toLowerCase().includes('condobi') ||
                  text.toLowerCase().includes('dashboard') ||
                  text.toLowerCase().includes('power bi')
    expect(hasBI).toBe(true)
  })

  it('displays AI assistant features', () => {
    render(<Home />)
    expect(screen.getAllByText(/Inteligência Artificial/i).length).toBeGreaterThan(0)
  })

  it('displays legal AI features', () => {
    render(<Home />)
    expect(screen.getAllByText(/Jurídica/i).length).toBeGreaterThan(0)
  })

  it('has a pricing section', () => {
    render(<Home />)
    // Check for pricing-related content
    expect(
      screen.getByText(/CondoBI Base/i) || screen.getByText(/planos/i)
    ).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeTruthy()
  })
})
