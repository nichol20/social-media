import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import { AuthProvider, User } from '../src/Contexts/AuthContext'

interface Wrapper {
  children: React.ReactNode
}

test("home page", async () => {
  const wrapper = ({ children }: Wrapper) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  )

  const fakeUser: User = {
    name: 'fakeName',
    email: 'fake@email.com',
    _id: 'fakeId',
    avatar: 'https://picsum.photos/200/300',
    avatar_path: 'https://picsum.photos/200/300',
    cover_photo: 'https://picsum.photos/200/300',
    cover_photo_path: 'https://picsum.photos/200/300',
    created_at: 0,
    liked_posts: [],
    posts: [],
    token: 'fakeToken'
  }

  
  render(<Home userData={fakeUser} />, { wrapper })

  expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
})