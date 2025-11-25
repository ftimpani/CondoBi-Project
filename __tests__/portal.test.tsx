import { render, screen, fireEvent } from '@testing-library/react'
import Portal from '@/pages/portal'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/portal',
      pathname: '/portal',
      query: {},
      asPath: '/portal',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }
})

describe('Portal Page', () => {
  it('renders the portal page', () => {
    render(<Portal />)
    expect(screen.getByText(/CondoBI/i)).toBeInTheDocument()
  })

  it('displays branding and login elements', () => {
    render(<Portal />)
    expect(screen.getByText(/CondoBI/i)).toBeInTheDocument()
    expect(screen.getByText(/Inteligência Condominial/i)).toBeInTheDocument()
  })

  it('has login form with email and password fields', () => {
    render(<Portal />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('has a demo login button', () => {
    render(<Portal />)
    const demoButton = screen.getByText(/Entrar como Demo/i)
    expect(demoButton).toBeInTheDocument()

    // Simulate clicking demo button
    fireEvent.click(demoButton)
  })

  it('switches between login and register tabs', () => {
    render(<Portal />)
    const registerButton = screen.getByText(/Cadastro/i)
    fireEvent.click(registerButton)
    expect(screen.getByText(/Nome Completo/i)).toBeInTheDocument()
  })

  it('displays interactive buttons', () => {
    render(<Portal />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders without crashing', () => {
    const { container } = render(<Portal />)
    expect(container).toBeTruthy()
  })

  it('has submit buttons', () => {
    render(<Portal />)
    const submitButtons = screen.getAllByText(/Entrar/i)
    expect(submitButtons.length).toBeGreaterThan(0)
  })
})
