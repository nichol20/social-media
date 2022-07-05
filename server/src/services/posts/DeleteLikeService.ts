import { ObjectId } from "mongodb";
import db from "../../db";

export class DeleteLikeService {
  async execute(postId: string, userId: string) {
    const posCollection = db.getDb().collection('posts')
    const userCollection = db.getDb().collection('users')
    const post = await posCollection.findOne({ _id: new ObjectId(postId) })
    const user = await userCollection.findOne({ _id: new ObjectId(userId) })

    if(!post) throw new Error('post not found')
    if(!user) throw new Error('user not found')

    const updatedLikedPosts = user.liked_posts.filter((id: string) => id !== postId)

    await userCollection.updateOne(user, {
      $set: {
        liked_posts: updatedLikedPosts
      }
    })

    return { 
      message: 'like successfully removed' 
    }
  }
}