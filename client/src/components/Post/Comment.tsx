import Image from 'next/image'
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'

import { AuthContext, User } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'
import { calculateLifetime } from '../../utils/timeStamp'
import { Comment as IComment } from '../Feed/Feed'
import { UserAvatar } from '../UserAvatar/UserAvatar'

import optionsIcon from '../../../public/options.svg'
import defaultAvatar from '../../../public/default.png'

interface CommentProps {
  comment: IComment
  postId: string
}

export const Comment = ({ comment, postId }: CommentProps) => {
  const { user } = useContext(AuthContext)
  const [ author, setAuthor ] = useState<User>()
  const [ commentLifetime, setCommentLifetime ] = useState('')
  const [ showSubmenu, setShowSubmenu ] = useState(false)
  const [ commentDeleted, setCommentDeleted ] = useState(false)
  const [ newComment, setNewComment ] = useState(comment.message)
  const [ message, setMessage ] = useState(comment.message)
  const editCommentModalEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data } = await http.get(`/users/${comment.author_id}`, {
          headers: {
            Authorization: `Bearer ${user!.token}`
          }
        })

        setAuthor(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAuthor()
    setCommentLifetime(calculateLifetime(comment.created_at))
  }, [comment, user])

  const deleteComment = async () => {
    try {
      await http.delete(`/posts/${postId}/comments/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })
      setCommentDeleted(true)
    } catch (error) {
      console.log(error)
    }
  }

  const editComment = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await http.patch(`/posts/${postId}/comments/${comment.id}`, { comment: newComment }, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })
      closeEditModal()
      setShowSubmenu(false)
      setMessage(newComment)
    } catch (error) {
      console.log(error)
    }
  }

  const showeEditModal = () => {
    if(editCommentModalEl.current !== null) editCommentModalEl.current.style.display = 'flex'
  }

  const closeEditModal = () => {
    if(editCommentModalEl.current !== null) editCommentModalEl.current.style.display = 'none'
  }

  if(!author) return <>Loading ...</>

  return (
    <div className='comment'>
      <div className="main">
        <UserAvatar
         userId={commentDeleted ? '' : author._id} 
         image={commentDeleted ? defaultAvatar : author.avatar} 
         width='25px' 
         height='25px' 
        />
        <div className="content">
          <span className="author_name">
            {commentDeleted ? '[deleted]' : author.name}
          </span>
          <span className="message">
            {commentDeleted ? 'deleted' : message}
          </span>
        </div>
        {
          author._id === user?._id && !commentDeleted && (
            <div className="options-box">
              <div className="image-box" onClick={() => setShowSubmenu(!showSubmenu)}>
                <Image src={optionsIcon} alt='options icon' width='20px' height='20px'/>
              </div>
              <div className={`submenu ${showSubmenu ? 'active' : ''}`}>
                <ul>
                  <li onClick={showeEditModal}>edit</li>
                  <li onClick={deleteComment}>delete</li>
                </ul>
              </div>
            </div>
          )
        }
      </div>
      <div className="footer">
        <span className="creation_time">{commentLifetime}</span>
      </div>

      <div className="edit_comment-modal" ref={editCommentModalEl}>
        <form className="container" onSubmit={editComment}>
          <div className='main_content'>
              <textarea
                placeholder="New comment..."
                name='description'
                onChange={e => setNewComment(e.target.value)} 
                defaultValue={comment.message}
                required
              />
          </div>
          <div className="footer">
            <div className="actions">
                <button className="cancel" onClick={closeEditModal} type='button'>Cancel</button>
                <button className="edit" type='submit'>Edit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

