import React, { useContext, useEffect, useState } from 'react'

import { AuthContext, User } from '../../Contexts/AuthContext'
import { http } from '../../utils/http'
import { calculateLifetime } from '../../utils/timeStamp'
import { Comment as IComment } from '../Feed/Feed'
import { UserAvatar } from '../UserAvatar/UserAvatar'

interface CommentProps {
  comment: IComment
}

export const Comment = ({ comment }: CommentProps) => {
  const { user } = useContext(AuthContext)
  const [ author, setAuthor ] = useState<User>()
  const [ commentLifetime, setCommentLifetime ] = useState('')

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

  return (
    <div className='comment'>
      <div className="main">
        <UserAvatar image={author?.image} width='25px' height='25px' />
        <div className="content">
          <span className="author_name">{author?.name}</span>
          <span className="message">{comment.message}</span>
        </div>
      </div>
      <div className="footer">
        <span className="creation_time">{commentLifetime}</span>
      </div>
    </div>
  )
}

