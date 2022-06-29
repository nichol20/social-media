import { NextPage } from 'next'
import Image from 'next/image'
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
  const [ confirmPasswordFocused, setConfirmPasswordFocused ] = useState(false)
  const [ disableNextButton, setDisableNextButton ] = useState(true)
  const [ emailExists, setEmailExists ] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = (document.querySelector('#register-form') as HTMLFormElement)
    const formData = new FormData(form)

    if(userImage === defaultImage.src) {
      formData.delete('image')

      const blobImage = await fetch(defaultImage.src).then(response => response.blob())
    
      formData.append('image', blobImage)
    }

    await signUp(formData)
  }

  const handleNextButton = () => {
    const stepsBox = (document.querySelector('.steps-box') as HTMLDivElement)
    stepsBox.style.left = '-400px'
  }

  const handleBackButton = () => {
    const stepsBox = (document.querySelector('.steps-box') as HTMLDivElement)
    stepsBox.style.left = '0'
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
              <input type='text' name='name' id='name' required onChange={e => setName(e.target.value)} />
            </div>
            
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input type='text' name='email' id='email' required onChange={e => setEmail(e.target.value)} />
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
               required
               onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className='field'>
              <label htmlFor='confirm_password'>Confirm Password</label>
              <input
               type='password' 
               id='confirm_password' 
               onChange={e => setConfirmPassword(e.target.value)}
               required onFocus={() => setConfirmPasswordFocused(true)}
              />
              {
                (password !== confirmPassword && confirmPasswordFocused)
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

              <label htmlFor='userImage' className='user_image-input'>
                <div className="image-box">
                  <Image src={pencilIcon} alt=''/>
                </div>
                <input
                 id='userImage' 
                 type='file' 
                 accept='.png, .jpg, .jpeg'
                 name='image'
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