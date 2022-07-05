import React, { Dispatch, SetStateAction, useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'

interface DeleteModalProps {
  postId: string
  refreshPosts: () => void
}

export const DeleteModal = ({ postId, refreshPosts }: DeleteModalProps) => {
  const { user } = useContext(AuthContext)

  const deletePost = async () => {
    try {
      await http.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })

      refreshPosts()
      closeDeleteModal()
    } catch (error) {
      console.log(error)
    }
  }

  const closeDeleteModal = () => {
    const deleteModal = (document.querySelector(`#deleteModal${postId}`) as HTMLDivElement)
    deleteModal.style.display = 'none'
  }

  return (
    <div className="delete_post-modal" id={`deleteModal${postId}`} >
      <div className="warning-container">
        <h2>Are you sure?</h2>
        <span>this action is irreversible!</span>
        <div className="actions-box">
          <button className='cancel' onClick={closeDeleteModal}>Cancel</button>
          <button className='delete' onClick={deletePost}>Delete</button>
        </div>
      </div>
    </div>
  )
}

