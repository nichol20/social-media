import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useContext, useEffect, useState } from 'react'

import defaultImage from '../../public/default.png'
import pencilIcon from '../../public/pencil.svg'
import { AuthContext } from '../Contexts/AuthContext'
import { http } from '../utils/http'

const Register: NextPage = () => {
  const { signUp } = useContext(AuthContext)
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ userImage, setUserImage ] = useState(defaultImage.src)
  const [ disableNextButton, setDisableNextButton ] = useState(true)
  const [ emailExists, setEmailExists ] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = (document.querySelector('#register-form') as HTMLFormElement)
    const formData = new FormData(form)

    if(userImage === defaultImage.src) {
      formData.delete('avatar')

      const blobImage = await fetch(defaultImage.src).then(response => response.blob())
      const file = new File([blobImage], 'profile_picture.png', {
        type: 'image/png'
      })
    
      formData.append('avatar', file)
    }

    await signUp(formData)
  }

  const handleNextButton = () => {
    const stepsBox = (document.querySelector('.steps-box') as HTMLDivElement)
    const carouselDiv = (document.querySelector('.carousel') as HTMLDivElement) 
    
    stepsBox.style.left = '-400px';
    (carouselDiv.children[0] as HTMLDivElement).style.background = 'rgba(0, 0, 0, 0.3)';
    (carouselDiv.children[1] as HTMLDivElement).style.background = '#1877f2';
  }

  const handleBackButton = () => {
    const stepsBox = (document.querySelector('.steps-box') as HTMLDivElement)
    const carouselDiv = (document.querySelector('.carousel') as HTMLDivElement) 
    stepsBox.style.left = '0';
    (carouselDiv.children[0] as HTMLDivElement).style.background = '#1877f2';
    (carouselDiv.children[1] as HTMLDivElement).style.background = 'rgba(0, 0, 0, 0.3)';
  }

  useEffect(() => {
    if(
      name.length > 0
      && email.length > 0
      && password.length > 0
      && confirmPassword.length > 0
      && password === confirmPassword
      && emailExists === false
    ) {
      setDisableNextButton(false)
    } else {
      setDisableNextButton(true)
    }
  }, [ confirmPassword, email, name, password, emailExists ])

  useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        const { data: { emailStatus } } = await http.post('/users/check-email-status', { email })

        if(emailStatus === 'registered') setEmailExists(true)
        else setEmailExists(false)
      } catch (error) {
        console.log(error)
      }
    }

    checkEmailStatus()
  }, [ email ])

  return (
    <div className='social_media_app-register'>
      <h1 className='social_media-logo'>Social Media</h1>
      <div className='carousel'>
        <div className='active'></div>
        <div></div>
      </div>

      <form className='register-interface' id='register-form' onSubmit={handleSubmit}>
        <div className='steps-box'>
          <div className='step'>
            <div className='field'>
              <label htmlFor='name'>Name</label>
              <input
               type='text' 
               name='name' 
               id='name' 
               data-testid='nameInput'
               required 
               onChange={e => setName(e.target.value)} 
              />
            </div>
            
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input
               type='email'
               name='email' 
               id='email' 
               data-testid='emailInput'
               required 
               onChange={e => setEmail(e.target.value)} 
              />
              {
                emailExists 
                ? (
                  <span className="email_unavailable">
                    Email already exists
                  </span>
                ) 
                : email.length > 0 && (
                  <span className="email_available">
                    Email available
                  </span>
                )
              }
            </div>

            <div className='field'>
              <label htmlFor='password'>Password</label>
              <input
               type='password' 
               id='password' 
               name='password'
               data-testid='passwordInput'
               required
               onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className='field'>
              <label htmlFor='confirm_password'>Confirm Password</label>
              <input
               type='password' 
               id='confirm_password'
               data-testid='confirmPasswordInput'
               onChange={e => setConfirmPassword(e.target.value)}
               required
              />
              {
                (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0)
                && <span className='confirm_password-mismatch_text'>
                    The Confirm Password does not match
                  </span>
              }
            </div>

            <button
             className='next-button' 
             type='button' 
             disabled={disableNextButton}
             onClick={handleNextButton}
            >
              Next
            </button>
            <span className='back_to_login-text'>
              Do you already have an account?
              <Link href='/login'><a>login</a></Link>
            </span>
          </div>

          <div className='step'>
            <div className='user_image-field'>
              <div className="user_image-box">
                <Image
                 src={userImage} 
                 alt='user' 
                 width='100px'
                 height='100px' 
                 objectFit='cover'
                />
              </div>

              <label htmlFor='userImage' className='user_image-input' data-testid='avatarLabel'>
                <div className="image-box">
                  <Image src={pencilIcon} alt=''/>
                </div>
                <input
                 id='userImage' 
                 type='file' 
                 accept='.png, .jpg, .jpeg'
                 name='avatar'
                 onChange={e => setUserImage(URL.createObjectURL(e.target.files![0]))}
                />
              </label>
            </div>
            
            <button className="register-button" type='submit'>Register</button>
            <button className="back-button" type='button' onClick={handleBackButton}>Back</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register