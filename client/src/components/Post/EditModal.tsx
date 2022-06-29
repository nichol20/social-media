import React, { FormEvent, useContext, useRef, useState } from 'react'

import { AuthContext } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'
import { PostData } from '../Feed/Feed'

import happyIcon from '../../../public/happy.svg'
import Image from 'next/image'
import { FeelingsPicker } from '../FeelingsPicker/FeelingsPicker'

interface EditModalProps {
  post: PostData
}

export const EditModal = ({ post }: EditModalProps) => {
  const { user } = useContext(AuthContext)
  const [ newDescription, setNewDescription ] = useState(post.description)
  const [ newFeeling, setNewFeeling ] = useState(post.feeling)
  const feelingPickerEl = useRef<HTMLDivElement>(null)

  const editPost = async (event: FormEvent) => {
    event.preventDefault()

    await http.patch(`/posts/${post._id}`, {
       description: newDescription,
       feeling: newFeeling
      }, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  }

  const showFeelingsPicker = () => {
    if(feelingPickerEl.current !== null) feelingPickerEl.current.style.display = 'flex'
  }

  const closeEditModal = () => {
    const editModal = (document.querySelector(`#editModal${post._id}`) as HTMLDivElement)
    editModal.style.display = 'none'
  }

  return (
    <div className="edit_post-modal" id={`editModal${post._id}`}>
        <form className="container" onSubmit={editPost}>
          <div className="header">
            <span className="author_name">{user?.name}</span>
            {
              newFeeling.length > 0 && (
                <span className="feeling_text">
                  {`is ${newFeeling.split(' ')[0]} feeling ${newFeeling.split(' ')[1]}`}
                </span>
              )
            }
          </div>

          <div className='main_content'>
            <textarea
             placeholder="What's in your mind ?"
             name='description'
             onChange={e => setNewDescription(e.target.value)} 
             defaultValue={post.description}
            />
          </div>
          
          <div className="footer">
            <ul className="options-list">
              <li className="options-item" onClick={showFeelingsPicker}>
                <div className="image-box">
                  <Image src={happyIcon} alt='happy icon' className='happy-icon'/>
                </div>
                <span>Feelings</span>
              </li>
            </ul>

            <div className="actions">
              <button className="cancel" onClick={closeEditModal} type='button'>Cancel</button>
              <button className="edit" type='submit'>Edit</button>
            </div>
          </div>
          <FeelingsPicker feelingPickerRef={feelingPickerEl} setFeeling={setNewFeeling} />
        </form>
      </div>
  )
}

