import React, { useContext, useEffect, useState } from 'react'
import { http } from '../../utils/http'
import { NewPostInput } from '../NewPostInput/NewPostInput'
import { Post } from '../Post/Post'

import defaultImage from '../../../public/default.png'
import { StaticImageData } from 'next/image'
import { AuthContext } from '../../Contexts/AuthContext'

export interface Comment {
  author_id: string
  message: string
  created_at: number
  id: string
}

export interface PostData {
  description: string
  feeling: string
  image?: string
  author_id: string
  comments: Comment[]
  created_at: number
  _id: string
}

interface FeedProps {
  query: string
  postIds?: string[]
  showNewPostInput?: boolean
}

export const Feed = ({ query, postIds, showNewPostInput=true }: FeedProps) => {
  const { user } = useContext(AuthContext)
  const [ posts, setPosts ] = useState<PostData[]>([])
  const [ updatePosts, setUpdatePosts ] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let data: PostData[]

        if(postIds) {
          data = await Promise.all(postIds.map(async id => {
            const response = await http.get(`/posts/${id}`, {
              headers: {
                Authorization: `Bearer ${user!.token}`
              }
            })
            return response.data
          }))

        } else {
          const response = await http.get('/posts',{
            headers: {
              Authorization: `Bearer ${user!.token}`
            }
          })

          data = response.data
        }

        data.reverse()
        setPosts(data)
      } catch (error) {
        console.log(error) 
      }
    }
    
    fetchPosts()
  }, [ user, updatePosts ])

  useEffect(() => {
    if(postIds) refreshPosts()
  }, [ postIds ])

  const refreshPosts = () => {
    setUpdatePosts(prevState => !prevState)
  }

  return (
    <div className='feed-component'>
      { showNewPostInput && <NewPostInput setUpdatePosts={setUpdatePosts} /> }
      {
        posts.map(post => {
          if(post.description.toLocaleLowerCase().includes(query)) {
            return <Post key={post._id} post={post} refreshPosts={refreshPosts} />
          }
        })
      }

    </div>
  )
}

