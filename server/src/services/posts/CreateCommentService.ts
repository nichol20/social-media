import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid'

import db from "../../db";

interface NewComment {
  author_id: string
  message: string
}

interface Comment {
  author_id: string
  message: string
  id: string
  created_at: number
}

export class CreateCommentService {
  async execute(postId: string, comment: NewComment) {
    const postCollection = db.getDb().collection('posts')
    let post = await postCollection.findOne({ _id: new ObjectId(postId) })

    if(!post) throw new Error('post not found')

    const commentId = uuidv4()
    await postCollection.updateOne(post, {
      $set: {
        comments: [...post.comments, {
          ...comment,
          created_at: Date.now(),
          id: commentId
        }]
      }
    })

    post = await postCollection.findOne({ _id: new ObjectId(postId) })


    return {
      comment: post!.comments.filter((comment: Comment) => comment.id === commentId)[0]
    }
  }
}