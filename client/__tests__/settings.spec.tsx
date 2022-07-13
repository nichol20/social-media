import { render, screen } from '@testing-library/react'
import { AuthProvider, User } from '../src/Contexts/AuthContext'
import Settings from '../src/pages/settings'

interface Wrapper {
  children: React.ReactNode
}

test("settings page", async () => {
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

  render(<Settings userData={fakeUser} />, { wrapper })

  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
})