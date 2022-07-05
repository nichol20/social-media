import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../src/pages/index'
import { AuthContext, AuthProvider } from '../src/Contexts/AuthContext'

interface Wrapper {
  children: React.ReactNode
}

describe("Index page", () => {
  test("", () => {
    const wrapper = ({ children }: Wrapper) => (
      <AuthProvider>
        {children}
      </AuthProvider>
    )
    const user = {
      _id: "62c0533a3cb1fb81e669421e",
      name: "joao",
      email: "joao@gmail.com",
      image: "http://localhost:5000/images/users/joao@gmail.com-1656771386435-flowers.jpg",
      image_path: "images/users/joao@gmail.com-1656771386435-flowers.jpg",
      posts: [''],
      liked_posts: [''],
      token: 'xixi',
      created_at: 1656771386445,
    }
    render(<Home userData={user} />, { wrapper })

    expect(screen.getByText(/Photo/i)).toBeInTheDocument()
  })
})