import { ObjectId } from "mongodb";
import db from "../../db";

interface Comment {
  id: string
  created_at: number
  message: string
  author_id: string
}

export class EditCommentService {
  async execute(postId: string, commentId: string, authorId: string, newMessage: string) {
    const postCollection = db.getDb().collection('posts')
    const post = await postCollection.findOne({ _id: new ObjectId(postId) })

    if(!post) throw new Error('post not found')

    const comment = await post.comments.filter((c: Comment) => c.id === commentId)[0]

    if(!comment) throw new Error('comment not found')

    const newComment = {
      ...comment,
      message: newMessage
    }

    const postCommentsUpdated = post.comments.map((c: Comment) => {
      if(c.id === commentId) {
        if(authorId !== c.author_id) throw new Error('You do not have permission to do this')
        return newComment
      }

      return c
    })

    await postCollection.updateOne(post, {
      $set: {
        comments: postCommentsUpdated
      }
    })

    return {
      comment: newComment
    }
  }
}