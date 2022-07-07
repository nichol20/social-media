import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import { AuthProvider } from '../src/Contexts/AuthContext'
import { http } from '../src/utils/http'

import defaultImage from '../public/default.png'

interface Wrapper {
  children: React.ReactNode
}

describe("Index page", () => {
  test("", async () => {
    const wrapper = ({ children }: Wrapper) => (
      <AuthProvider>
        {children}
      </AuthProvider>
    )

    const newUser = {
      name: 'test',
      email: 'test@gmail.com',
      password: 'test123'
    }

    const blobImage = await fetch(defaultImage.src).then(response => response.blob())

    const formData = new FormData()
    formData.append('name', newUser.name)
    formData.append('email', newUser.email)
    formData.append('password', newUser.password)
    formData.append('avatar', blobImage)

    const { data } =  await http.post('/users', formData)

    console.log(data)
    
    // render(<Home userData={user} />, { wrapper })

    // expect(screen.getByText(/Photo/i)).toBeInTheDocument()
  })
})