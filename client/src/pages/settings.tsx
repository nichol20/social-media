import { GetServerSideProps, NextPage } from 'next'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { MainHeader } from '../components/MainHeader/MainHeader'
import { AuthContext, User } from '../Contexts/AuthContext'
import { http } from '../utils/http'
import { withAuth } from '../utils/withAuth'

interface SettingsProps {
  userData: User
}

const Settings: NextPage<SettingsProps> = ({ userData }) => {
  const { user, setUser, signOut } = useContext(AuthContext)
  const [ query, setQuery ] = useState('')
  const [ currentPasswordOfEmailForm, setCurrentPasswordOfEmailForm ] = useState('')
  const [ newEmail, setNewEmail ] = useState('')
  const [ incorrectPasswordErrorOfEmailForm, setIncorrectPasswordErrorOfEmailForm] = useState(false)
  const [ currentPasswordOfPasswordForm, setCurrentPasswordOfPasswordForm ] = useState('')
  const [ newPassword, setNewPassword ] = useState('')
  const [ confirmNewPassword, setConfirmNewPassword ] = useState('')
  const [ incorrectPasswordErrorOfPasswordForm, setIncorrectPasswordErrorOfPasswordForm ] = useState(false)
  const [ mismatchPasswordError, setMismatchPasswordError ] = useState(false)
  
  useEffect(() =>  setUser(userData), [ setUser, userData ])
  
  useEffect(() => {
    if(
      newPassword.length > 0 
      && confirmNewPassword.length > 0
      && newPassword !== confirmNewPassword
    ) {
      setMismatchPasswordError(true)
    } else {
      setMismatchPasswordError(false)
    }
  }, [ newPassword, confirmNewPassword ])

  if(!user) return <>Loading...</>
  
  const changeEmail = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('#changeEmailForm') as HTMLFormElement)
    
    try {
      await http.put(`/users/${user._id}/change-email`, {
        email: newEmail,
        password: currentPasswordOfEmailForm
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      form.reset()
      setNewEmail('')
      setCurrentPasswordOfEmailForm('')
    } catch (error: any) {
      if(error.response.data.message === 'Incorrect password') setIncorrectPasswordErrorOfEmailForm(true)
      console.log(error)
    }

  }

  const changePassword = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('#changePasswordForm') as HTMLFormElement)

    if(newPassword !== confirmNewPassword) return

    try {
      await http.put(`/users/${user._id}/change-password`, {
        current_password: currentPasswordOfPasswordForm,
        new_password: newPassword
      } , {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      form.reset()
      setNewPassword('')
      setConfirmNewPassword('')
      setCurrentPasswordOfPasswordForm('')
    } catch (error: any) {
      if(error.response?.data?.message === 'Incorrect password') setIncorrectPasswordErrorOfPasswordForm(true)
      console.log(error)
    }
  }

  const deleteAccount = async () => {
    try {
      await http.delete(`/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      signOut()
    } catch (error) {
      console.log(error)
    }
  }


  const showDeleteAccountModal = () => {
    (document.querySelector('.delete_account-modal') as HTMLDivElement).style.display = 'flex'
  }

  const closeDeleteAccountModal = () => {
    (document.querySelector('.delete_account-modal') as HTMLDivElement).style.display = 'none'
  }

  return (
    <div className='social_media_app-settings'>
      <MainHeader setQuery={setQuery}/>
      <div className='settings-container'>
        <div className='settings-nav'>
          <h1>Settings</h1>
          <ul className='items'>
            <li>Email and Password</li>
            <li className='delete' onClick={showDeleteAccountModal}>Delete account</li>
          </ul>
        </div>

        <div className='settings-content'>
          <form className="change_email-form" id='changeEmailForm' onSubmit={changeEmail} >
            <h2>Email</h2>
            <div className='field'>
              <label htmlFor='newEmailOfEmailChangeForm'>Email</label>
              <input
               type='text' 
               name='email' 
               required
               id='newEmailOfEmailChangeForm'
               onChange={e => setNewEmail(e.target.value)}
              />
            </div>
            <div className='field'>
              <label htmlFor='currentPasswordOfEmailChangeForm'>Current Password</label>
              <input
               type='password' 
               name='password' 
               id='currentPasswordOfEmailChangeForm'
               required
               onChange={e => {
                setIncorrectPasswordErrorOfEmailForm(false)
                setCurrentPasswordOfEmailForm(e.target.value)
               }}
              />
            </div>
            {
              incorrectPasswordErrorOfEmailForm
              && <span className='current_password_error-text'>Incorrect password</span>
            }
            <button className="change_email-button" type='submit'>Change email</button>
          </form>

          <form className="change_password-form" id='changePasswordForm' onSubmit={changePassword} >
            <h2>Password</h2>
            <div className="field">
              <label htmlFor="currentPasswordOfChangePasswordForm">Current Password</label>
              <input
               type="password" 
               id="currentPasswordOfChangePasswordForm"
               required
               onChange={e => {
                setCurrentPasswordOfPasswordForm(e.target.value)
                setIncorrectPasswordErrorOfPasswordForm(false)
               }}
              />
            </div>
            <div className="field">
              <label htmlFor="newPasswordOfChangePasswordForm">New Password</label>
              <input
               type="password" 
               id="newPasswordOfChangePasswordForm" 
               required
               onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="confirmNewPasswordOfChangePasswordForm">Confirm New Password</label>
              <input
               type="password" 
               id="confirmNewPasswordOfChangePasswordForm" 
               required
               onChange={e => setConfirmNewPassword(e.target.value)} 
              />
            </div>
            {
              incorrectPasswordErrorOfPasswordForm 
              ? <span className='current_password_error-text'>
                Incorrect password
              </span>
              
              : mismatchPasswordError 
              && <span className='confirm_password-mismatch_text'>
                The Confirm Password does not match
              </span>
            }
            <button className="change_password-button" type='submit'>Change password</button>
          </form>
        </div>
      </div>

      <div className="delete_account-modal">
        <div className="warning-container">
          <h2>Are you sure?</h2>
          <span>this action is irreversible!</span>
          <div className="actions-box">
            <button className='cancel' onClick={closeDeleteAccountModal}>Cancel</button>
            <button className='delete' onClick={deleteAccount}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async context => {
    return {
      props: {}
    }
  }
)

export default Settings