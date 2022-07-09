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
  
  useEffect(() =>  setUser(userData), [ setUser, userData ])
  
  if(!user) return <>Loading...</>
  
  const changeEmail = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('#changeEmailForm') as HTMLFormElement)
    const formData = new FormData(form)
    
    try {
      await http.patch(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
    } catch (error) {
      console.log(error)
    }

  }

  const changePassword = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('#changePasswordForm') as HTMLFormElement)
    const formData = new FormData(form)

    try {
      await http.patch(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
    } catch (error) {
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
              <label htmlFor='ChangeEmailFormNewEmail'>Email</label>
              <input type='text' name='email' id='ChangeEmailFormNewEmail' defaultValue={user.email} />
            </div>
            <div className='field'>
              <label htmlFor='ChangeEmailFormCurrentPassword'>Current Password</label>
              <input type='password' name='password' id='ChangeEmailFormCurrentPassword'/>
            </div>
            <button className="change_email-button" type='submit'>Change email</button>
          </form>

          <form className="change_password-form" id='changePasswordForm' onSubmit={changePassword} >
            <h2>Password</h2>
            <div className="field">
              <label htmlFor="ChangePasswordFormCurrentPassowrd">Current Password</label>
              <input type="password" name="" id="ChangePasswordFormCurrentPassowrd" />
            </div>
            <div className="field">
              <label htmlFor="ChangePasswordFormNewPassword">New Password</label>
              <input type="password" name="password" id="ChangePasswordFormNewPassword" />
            </div>
            <div className="field">
              <label htmlFor="ChangePasswordFormConfirmNewPassword">Confirm New Password</label>
              <input type="password" name="" id="ChangePasswordFormConfirmNewPassword" />
            </div>
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