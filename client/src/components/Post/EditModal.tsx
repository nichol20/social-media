import React, { FormEvent, useContext, useState } from 'react'

import { AuthContext } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'
import { PostData } from '../Feed/Feed'

import happyIcon from '../../../public/happy.svg'
import Image from 'next/image'

interface EditModalProps {
  post: PostData
}

export const EditModal = ({ post }: EditModalProps) => {
  const { user } = useContext(AuthContext)
  const [ newDescription, setNewDescription ] = useState(post.description)

  const editPost = async (event: FormEvent) => {
    event.preventDefault()

    await http.patch(`/posts/${post._id}`, { description: newDescription }, {
      headers: {
        Authorization: `Bearer ${user!.token}`
      }
    })
  }

  const closeEditModal = () => {
    const editModal = (document.querySelector(`#editModal${post._id}`) as HTMLDivElement)
    editModal.style.display = 'none'
  }

  return (
    <div className="edit_post-modal" id={`editModal${post._id}`} >
        <form className="container" onSubmit={editPost}>

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
              <li className="options-item">
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

        </form>
      </div>
  )
}

