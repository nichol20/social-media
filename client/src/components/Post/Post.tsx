import React, { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { UserAvatar } from '../UserAvatar/UserAvatar'
import { PostData } from '../Feed/Feed'
import { AuthContext, User } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'

import optionsIcon from '../../../public/options.svg'
import happyIcon from '../../../public/happy.svg'

interface PostProps {
  post: PostData
  setPosts: Dispatch<SetStateAction<PostData[]>>
}

export const Post = ({ post, setPosts }: PostProps) => {
  const { user } = useContext(AuthContext)
  const [ showSubmenu, setShowSubmenu ] = useState(false)
  const [ author, setAuthor ] = useState<User>()
  const [ newDescription, setNewDescription ] = useState(post.description)

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
  }, [post, user])

  const deletePost = async () => {
    try {
      await http.delete(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })

      setPosts(prevState => prevState.filter(p => p._id !== post._id))
      closeDeleteModal()
    } catch (error) {
      console.log(error)
    }
  }

  const editPost = async (event: FormEvent) => {
    event.preventDefault()

    await http.patch(`/posts/${post._id}`, { description: newDescription }, {
      headers: {
        Authorization: `Bearer ${user!.token}`
      }
    })
  }
  
  const showDeleteModal = () => {
    const deleteModal = (document.querySelector(`#deleteModal${post._id}`) as HTMLDivElement)
    deleteModal.style.display = 'flex'
    setShowSubmenu(false)
  }

  const closeDeleteModal = () => {
    const deleteModal = (document.querySelector(`#deleteModal${post._id}`) as HTMLDivElement)
    deleteModal.style.display = 'none'
  }

  const showEditModal = () => {
    const editModal = (document.querySelector(`#editModal${post._id}`) as HTMLDivElement)
    editModal.style.display = 'flex'
    setShowSubmenu(false)
  }

  const closeEditModal = () => {
    const editModal = (document.querySelector(`#editModal${post._id}`) as HTMLDivElement)
    editModal.style.display = 'none'
  }

  return (
    <div className='post-component'>
      <div className="header">
        <div className="information">
          <UserAvatar width='35px' height='35px' image={author?.image} />
          <span className='user_name'>{author?.name}</span>
          <span className="creation_time">5 min ago</span>
        </div>

        {
          author?._id === user?._id && (
            <div className="options-box">
              <div className="image-box" onClick={() => setShowSubmenu(!showSubmenu)}>
                <Image src={optionsIcon} alt=""/>
              </div>
              <div className={`submenu-container ${showSubmenu && 'active'}`}>
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
      </div>

      <div className="delete_post-modal" id={`deleteModal${post._id}`} >
        <div className="warning-container">
          <h2>Are you sure?</h2>
          <span>this action is irreversible!</span>
          <div className="actions-box">
            <button className='cancel' onClick={closeDeleteModal}>Cancel</button>
            <button className='delete' onClick={deletePost}>Delete</button>
          </div>
        </div>
      </div>

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
    </div>
  )
}