import { ObjectId } from "mongodb";
import db from "../../db";

interface Comment {
  id: string
  created_at: number
  message: string
  author_id: string
}

export class DeleteCommentService {
  async execute(postId: string, commentId: string) {
    const postCollection = db.getDb().collection('posts')
    const post = await postCollection.findOne({ _id: new ObjectId(postId) })

    if(!post) throw new Error('post not found')

    await postCollection.updateOne(post, {
      $set: {
        comments: [...post.comments.filter((comment: Comment) => comment.id !== commentId)]
      }
    })

    return { 
      message: 'comment successfully deleted' 
    }
  }
}