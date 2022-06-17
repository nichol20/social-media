import React, { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react'
import Image from 'next/image'

import { UserAvatar } from '../UserAvatar/UserAvatar'
import { http } from '../../utils/http'
import { AuthContext } from '../../Contexts/AuthContext'

import imagesIcon from '../../../public/images.svg'
import happyIcon from '../../../public/happy.svg'
import { PostData } from '../Feed/Feed'

interface NewPostInputProps {
  setUpdatePosts: Dispatch<SetStateAction<boolean>>
}

export const NewPostInput = ({ setUpdatePosts }: NewPostInputProps) => {
  const { user } = useContext(AuthContext)
  const [ postImage, setPostImage ] = useState('')
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('.new_post_input-component') as HTMLFormElement)
    const formData = new FormData(form)

    try {
      await http.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })

      const descriptionTextarea = (document.querySelector('#descriptionTextarea') as HTMLTextAreaElement)
      descriptionTextarea.value = ''
      setPostImage('')
      setUpdatePosts(prevState => !prevState)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className='new_post_input-component' onSubmit={handleSubmit}>
      <div className="main_content">
        <UserAvatar width='50px' height='50px' image={user!.image} />
        <textarea placeholder="What's in your mind ?" name='description' id='descriptionTextarea' />
      </div>


      {
        postImage.length > 0 && (
          <div className="post_image-example-box">
            <Image src={postImage} layout='fill' objectFit='contain' alt='post' />
          </div>
        )
      }
      
      <div className="options-container">
        
        <ul className="options-list">
          <label htmlFor="postImage">
            <li className="options-item">
                <div className="image-box">
                  <Image src={imagesIcon} alt='images icon' className='images-icon'/>
                </div>
              <span>Photo</span>
            </li>
            <input
             type="file" 
             id='postImage' 
             accept='.png, .jpg, .jpeg' 
             name='image' 
             onChange={e => setPostImage(URL.createObjectURL(e.target.files![0]))}
            />
          </label>
          <li className="options-item">
            <div className="image-box">
              <Image src={happyIcon} alt='happy icon' className='happy-icon'/>
            </div>
            <span>Feelings</span>
          </li>
        </ul>

        <button className="share-button" type='submit'>Share</button>
      </div>
    </form>
  )
}
