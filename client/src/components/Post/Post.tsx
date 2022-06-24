import React, { Dispatch, FormEvent, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { UserAvatar } from '../UserAvatar/UserAvatar'
import { PostData } from '../Feed/Feed'
import { AuthContext, User } from '../../Contexts/AuthContext'
import { Comment } from './Comment'
import { http } from '../../utils/http'
import { EditModal } from './EditModal'
import { DeleteModal } from './DeleteModal'
import { calculateLifetime } from '../../utils/timeStamp'

import optionsIcon from '../../../public/options.svg'
import heartIcon from '../../../public/heart.svg'
import commentIcon from '../../../public/chatbox-outline.svg'
import shareIcon from '../../../public/arrow-redo-outline.svg'

interface PostProps {
  post: PostData
  setUpdatePosts: Dispatch<SetStateAction<boolean>>
}

export const Post = ({ post, setUpdatePosts }: PostProps) => {
  const { user } = useContext(AuthContext)
  const [ showSubmenu, setShowSubmenu ] = useState(false)
  const [ showComments, setShowComments ] = useState(false)
  const [ userLiked, setUserLiked ] = useState(user!.likedPosts.includes(post._id))
  const [ author, setAuthor ] = useState<User>()
  const [ postLifetime, setPostLifetime ] = useState('')

  useEffect(() => {
    const fetchAuthor = async () => {
      const { data } = await http.get(`/users/${post.author_id}`, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })
      setAuthor(data)
    }

    fetchAuthor()
    setPostLifetime(calculateLifetime(post.created_at))
  }, [post, user])

  const handleLike = async () => {
    if(!userLiked) {
      try {
        await http.post(`/posts/${post._id}/like`, undefined, {
          headers: {
            Authorization: `Bearer ${user!.token}`
          }
        })
        setUserLiked(!userLiked)
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await http.delete(`/posts/${post._id}/like`, {
          headers: {
            Authorization: `Bearer ${user!.token}`
          }
        })
        setUserLiked(!userLiked)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const submitComment = async (event: KeyboardEvent) => {
    if(event.key === 'Enter') {
      const input = event.target as HTMLInputElement
      const message = input.value

      try {
        await http.post(`/posts/${post._id}/comments`, { comment: message }, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        })
        input.value = ''
        setUpdatePosts(prevState => !prevState)
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  const showDeleteModal = () => {
    const deleteModal = (document.querySelector(`#deleteModal${post._id}`) as HTMLDivElement)
    deleteModal.style.display = 'flex'
    setShowSubmenu(false)
  }

  const showEditModal = () => {
    const editModal = (document.querySelector(`#editModal${post._id}`) as HTMLDivElement)
    editModal.style.display = 'flex'
    setShowSubmenu(false)
  }

  return (
    <div className='post-component'>
      <div className="header">
        <div className="information">
          <UserAvatar width='35px' height='35px' image={author?.image} />
          <span className='user_name'>{author?.name}</span>
          <span className="creation_time">{postLifetime} ago</span>
        </div>

        {
          author?._id === user?._id && (
            <div className="options-box">
              <div className="image-box" onClick={() => setShowSubmenu(!showSubmenu)}>
                <Image src={optionsIcon} alt="options"/>
              </div>
              <div className={`submenu-container ${showSubmenu ? 'active' : ''}`}>
                <ul className="submenu-list">
                  <li onClick={showEditModal}>edit</li>
                  <li onClick={showDeleteModal} >delete</li>
                </ul>
              </div>
            </div>
          )
        }
      </div>

      <div className="content">
        <p className="description">{post.description}</p>   
          {
            post.image && (
              <div className="image-box">
                <Image src={post.image} layout='fill' objectFit='contain' alt='post'/>
              </div>
            )
          }

        <div className="actions-box">
          <ul className="actions-list">
            <li className="action" onClick={handleLike}>
              <Image
               src={heartIcon} 
               alt='heart' 
               width='25px' 
               height='25px' 
               className={`heart-icon ${userLiked ? 'active' : ''}`}
              />
              Like
            </li>
            <li className="action" onClick={() => setShowComments(!showComments)} >
              <Image src={commentIcon} alt='comment' width='25px' height='25px' />
              Comment
            </li>
            <li className="action">
              <Image src={shareIcon} alt='share' width='25px' height='25px' />
              Share
            </li>
          </ul>
        </div>

        {
          showComments && (
            <div className="comments" id={`comments${post._id}`}>
              <div className="new_comment-box">
                <UserAvatar width='25px' height='25px' image={author?.image} />
                <input
                type="text" 
                placeholder='write a comment...' 
                className='new_comment-input' 
                onKeyDown={submitComment}
              />
              </div>
              {
                post.comments.map((comment, index) => {
                  return <Comment comment={comment} key={index} />
                })
              }
            </div>
          )
        }
      </div>

      <DeleteModal postId={post._id} setUpdatePosts={setUpdatePosts} />
      <EditModal post={post} />
    </div>
  )
}