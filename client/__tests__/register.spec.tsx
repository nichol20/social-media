import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from '../src/pages/register'

describe("Registere page", () => {
  test("next button should be disabled", () => {
    render(<Register />)

    const nextButton = screen.getByRole('button', { name: /next/i })

    expect(nextButton).toBeDisabled()
  })

  test("next button should be enabled", async () => {
    render(<Register />)

    const user = {
      name: 'test',
      email: 'email@test.com',
      password: '123'
    }
    
    const nameInput = screen.getByTestId('nameInput')
    const emailInput = screen.getByTestId('emailInput')
    const passwordInput = screen.getByTestId('passwordInput')
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput')
    
    await userEvent.type(nameInput, user.name)
    await userEvent.type(emailInput, user.email)
    await userEvent.type(passwordInput, user.password)
    await userEvent.type(confirmPasswordInput, user.password)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    
    expect(nextButton).toBeEnabled()

  })
})