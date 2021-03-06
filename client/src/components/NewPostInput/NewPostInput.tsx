import React, { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { UserAvatar } from '../UserAvatar/UserAvatar'
import { http } from '../../utils/http'
import { AuthContext } from '../../Contexts/AuthContext'
import { FeelingsPicker } from '../FeelingsPicker/FeelingsPicker'

import imagesIcon from '../../../public/images.svg'
import happyIcon from '../../../public/happy.svg'
import closeIcon from '../../../public/close.svg'

interface NewPostInputProps {
  refreshPosts: () => void
  refreshAuthor?: () => void
}

export const NewPostInput = ({ refreshPosts, refreshAuthor }: NewPostInputProps) => {
  const { user } = useContext(AuthContext)
  const [ postImage, setPostImage ] = useState('')
  const [ feeling, setFeeling ] = useState('')
  const [ feelingText, setFeelingText ] = useState('')
  const feelingPickerEl = useRef<HTMLDivElement>(null)
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const form = (document.querySelector('.new_post_input-component') as HTMLFormElement)
    const formData = new FormData(form)
    formData.append('feeling', feeling)

    try {
      await http.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })

      const descriptionTextarea = (document.querySelector('#descriptionTextarea') as HTMLTextAreaElement)
      const postImageInput = (document.querySelector('#postImageInput') as HTMLInputElement)
      postImageInput.value = ''
      descriptionTextarea.value = ''
      setPostImage('')
      if(refreshAuthor) refreshAuthor()
      refreshPosts()
      setFeelingText('')
    } catch (error) {
      console.log(error)
    }
  }

  const removeImage = () => {
    setPostImage('')
  }

  useEffect(() => {
    if(feeling.length > 0) {
      setFeelingText(`is ${(feeling.split(' ')[0])} feeling ${feeling.split(' ')[1]}`)
      if(feeling === 'none') setFeelingText('')
    }
  }, [ feeling ])

  const showFeelingsPicker = () => {
    if(feelingPickerEl.current !== null) feelingPickerEl.current.style.display = 'flex'
  }

  return (
    <form className='new_post_input-component' onSubmit={handleSubmit}>
      <div className="main_content">
        <UserAvatar userId={user!._id} width='50px' height='50px' image={user!.avatar} />
        <div>
          <span>{`${user?.name} ${feelingText}`}</span>
          <textarea placeholder="What's in your mind ?" name='description' id='descriptionTextarea' />
        </div>
      </div>


      {
        postImage.length > 0 && (
          <div className="post_image-example-box">
            <Image src={postImage} layout='fill' objectFit='contain' alt='post' />
            <button className="remove_image-button" onClick={removeImage}>
              <Image src={closeIcon} alt='close icon' width='20px' height='20px' />
            </button>
          </div>
        )
      }
      
      <div className="options-container">
        
        <ul className="options-list">
          <label htmlFor="postImageInput" data-testid='postImageLabel' >
            <li className="options-item">
                <div className="image-box">
                  <Image src={imagesIcon} alt='images icon' className='images-icon'/>
                </div>
              <span>Photo</span>
            </li>
            <input
             type="file" 
             id='postImageInput' 
             accept='.png, .jpg, .jpeg' 
             name='image' 
             onChange={e => setPostImage(URL.createObjectURL(e.target.files![0]))}
            />
          </label>
          <li className="options-item" data-testid='feelingsPickerOption' onClick={showFeelingsPicker}>
            <div className="image-box">
              <Image src={happyIcon} alt='happy icon' className='happy-icon'/>
            </div>
            <span>Feelings</span>
          </li>
        </ul>

        <button className="share-button" type='submit'>Share</button>
      </div>
      <FeelingsPicker feelingPickerRef={feelingPickerEl} setFeeling={setFeeling}/>
    </form>
  )
}
