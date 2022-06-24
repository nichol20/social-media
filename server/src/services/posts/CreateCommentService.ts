import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid'

import db from "../../db";

interface NewComment {
  author_id: string
  message: string
}

export class CreateCommentService {
  async execute(postId: string, comment: NewComment) {
    const postCollection = db.getDb().collection('posts')
    const post = await postCollection.findOne({ _id: new ObjectId(postId) })

    if(!post) throw new Error('post not found')

    await postCollection.updateOne(post, {
      $set: {
        comments: [...post.comments, {
          ...comment,
          created_at: Date.now(),
          id: uuidv4()
        }]
      }
    })
  }
}