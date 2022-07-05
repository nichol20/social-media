import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'

import { Feed } from '../../components/Feed/Feed'
import { MainHeader } from '../../components/MainHeader/MainHeader'
import { UserAvatar } from '../../components/UserAvatar/UserAvatar'
import { AuthContext, User } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'
import { withAuth } from '../../utils/withAuth'

import imagesIcon from '../../../public/images.svg'
import pencilIcon from '../../../public/pencil.svg'
import closeIcon from '../../../public/close.svg'
import checkmarkIcon from '../../../public/checkmark.svg'
import defaultCoverPhoto from '../../../public/white-background.jpg'
import defaultAvatar from '../../../public/default.png'

interface UserPageProps {
  userData: User
}

const UserPage: NextPage<UserPageProps> = ({ userData }) => {
  const { user, setUser } = useContext(AuthContext)
  const [ query, setQuery ] = useState('')
  const [ changingCoverPhoto, setChangingCoverPhoto ] = useState(false)
  const [ changingAvatar, setChangingAvatar  ] = useState(false)
  const [ profileAuthor, setProfileAuthor ] = useState<User | null>(null)
  const [ avatar, setAvatar ] = useState(defaultAvatar.src)
  const [ coverPhoto, setCoverPhoto ] = useState(defaultCoverPhoto.src)
  const router = useRouter()
  const { id: profileAuthorId } = router.query

  useEffect(() =>  setUser(userData), [ setUser, userData ])

  useEffect(() => {
    const fetchProfileAuthor = async () => {
      if(!user) return
      try {
        const { data } = await http.get(`/users/${profileAuthorId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })

        setProfileAuthor(data)
        setCoverPhoto(data.cover_photo.length > 0 ? data.cover_photo : defaultCoverPhoto.src)
        setAvatar(data.avatar)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfileAuthor()
  }, [ user ])

  const cancelCoverPhotoChange = () => {
    setChangingCoverPhoto(false)
    setCoverPhoto(profileAuthor!.cover_photo.length > 0 ? profileAuthor!.cover_photo : defaultCoverPhoto.src)
  }

  const changeCoverPhoto = async () => {
    if(!user) return
    try {
      const formData = new FormData()
      const blobImage = await fetch(coverPhoto).then(response => response.blob())

      formData.append('cover_photo', blobImage)

      await http.patch(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setChangingCoverPhoto(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCoverPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChangingCoverPhoto(true)
    setCoverPhoto(URL.createObjectURL(event.target.files![0]))
  }

  const cancelAvatarChange = () => {
    setChangingAvatar(false)
    setAvatar(profileAuthor?.avatar)
  }

  const changeAvatar = async () => {
    if(!user) return
    try {
      const formData = new FormData()
      const blobImage = await fetch(avatar).then(response => response.blob())

      formData.append('avatar', blobImage)

      await http.patch(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setChangingAvatar(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChangingAvatar(true)
    setAvatar(URL.createObjectURL(event.target.files![0]))
  }

  if(!profileAuthor || !user) return <>Loading...</>
  
  return (
    <div className='social_media_app-user_page' >
      <MainHeader setQuery={setQuery} />

      <div className="profile-container">
        <div className="profile_cover">
          <div className="banner_image-box">
            <Image src={coverPhoto} alt={profileAuthor.name} layout='fill' objectFit='fill' />
            {
              user._id === profileAuthor._id
              ? changingCoverPhoto ? (
                <>
                  <button className="cancel-button" onClick={cancelCoverPhotoChange}>
                    <Image src={closeIcon} alt='close icon' height='20px' width='20px' />
                  </button>
                  <button className='change-button' onClick={changeCoverPhoto}>
                    <Image src={pencilIcon} alt='pencil icon' height='20px' width='20px' />
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <label htmlFor="changeBannerPicture">
                    <Image src={imagesIcon} alt='images icon' height='24px' width='24px'/>
                    Edit cover photo
                  </label>
                  <input
                  type="file" 
                  id='changeBannerPicture' 
                  accept='.png, .jpg, .jpeg' 
                  onChange={handleCoverPhotoChange} 
                  />
                </>
              ) : (
                <></>
              )
            }
          </div>
          <div className="main">
            <div className="profile_user_image-box">
              <UserAvatar userId={profileAuthor._id} image={avatar} height='100px' width='100px' />
              {
                user._id === profileAuthor._id ?
                 changingAvatar ? (
                  <>
                    <button className="cancel-button" onClick={cancelAvatarChange}>
                      <Image src={closeIcon} alt='close icon' height='20px' width='20px' />
                    </button>
                    <button className='change-button' onClick={changeAvatar}>
                      <Image src={checkmarkIcon} alt='checkmark icon' height='20px' width='20px' />
                    </button>
                  </>
                 ) : (
                  <>
                    <label htmlFor="changeAvatar">
                      <Image src={pencilIcon} alt='images icon' height='20px' width='20px'/>
                    </label>
                    <input
                      type="file" 
                      id='changeAvatar' 
                      accept='.png, .jpg, .jpeg' 
                      onChange={handleAvatarChange} 
                    />
                  </>
                 ) 
                : (
                  <></>
                )
              }
            </div>
            <h1 className='profile_user_name'>{profileAuthor.name}</h1>
          </div>
        </div>
        <Feed query={query} postIds={profileAuthor.posts} showNewPostInput={profileAuthor._id === user._id} />
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

export default UserPage