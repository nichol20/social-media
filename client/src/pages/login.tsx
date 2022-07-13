import { NextPage } from 'next'
import Link from 'next/link'
import { FormEvent, useContext, useState } from 'react'

import { AuthContext } from '../Contexts/AuthContext'

const Login: NextPage = () => {
  const { signIn } = useContext(AuthContext)
  const [ invalidCredentials, setInvalidCredentials ] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const email = (document.querySelector('#email') as HTMLInputElement).value
    const password = (document.querySelector('#password') as HTMLInputElement).value

    try {
      await signIn({ email, password })
    } catch (error: any) {
      if(error.response?.data?.message === 'user not found') {
        setInvalidCredentials(true)
      }
    }
  }

  return (
    <div className='social_media_app-login'>
      <h1 className="social_media-logo">Social Media</h1>
      <form className="login-interface" onSubmit={handleSubmit}>
        {
          invalidCredentials && (
            <span className='invalid_credentials-error'>Invalid Credentials</span>
          )
        }
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