import React, { useContext, useEffect, useState } from 'react'
import { http } from '../../utils/http'
import { NewPostInput } from '../NewPostInput/NewPostInput'
import { Post } from '../Post/Post'

import defaultImage from '../../../public/default.png'
import { StaticImageData } from 'next/image'
import { AuthContext } from '../../Contexts/AuthContext'

export interface PostData {
  description: string
  image?: string
  author_id: string
  created_at: number
  _id: string
}

interface FeedProps {
  query: string
}

export const Feed = ({ query }: FeedProps) => {
  const { user } = useContext(AuthContext)
  const [ posts, setPosts ] = useState<PostData[]>([])
  const [ updatePosts, setUpdatePosts ] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const {data} = await http.get('/posts',{
        headers: {
          Authorization: `Bearer ${user!.token}`
        }
      })

      data.reverse()
      setPosts(data)
    }
    
    fetchPosts()
  }, [ user, updatePosts ])

  return (
    <div className='feed-component'>
      <NewPostInput setUpdatePosts={setUpdatePosts} />
      {
        posts.map(post => {
          if(post.description.includes(query)) {
            return <Post key={post._id} post={post} setPosts={setPosts} />
          }
        })
      }

    </div>
  )
}

