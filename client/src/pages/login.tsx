import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useContext } from 'react'
import { AuthContext } from '../Contexts/AuthContext'

const Login: NextPage = () => {
  const { signIn } = useContext(AuthContext)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const email = (document.querySelector('#email') as HTMLInputElement).value
    const password = (document.querySelector('#password') as HTMLInputElement).value

    await signIn({ email, password })
  }

  return (
    <div className='social_media_app-login'>
      <h1 className="social_media-logo">Social Media</h1>
      <form className="login-interface" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="text" id='email'/>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input type="password" id='password'/>
        </div>

        <button className="login-button" type='submit'>Login</button>
        <Link href='/register'><a className="create_account-button">Create account</a></Link>
      </form>
    </div>
  )
}

export default Login