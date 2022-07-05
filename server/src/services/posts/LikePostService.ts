import { ObjectId } from "mongodb";
import db from "../../db";

export class LikePostService {
  async execute(postId: string, userId: string) {
    const userCollection = db.getDb().collection('users')
    const postCollection = db.getDb().collection('posts')
    const user = await userCollection.findOne({ _id: new ObjectId(userId) })
    const post = await postCollection.findOne({ _id: new ObjectId(postId) })

    if(!user) throw new Error('user not found')
    if(!post) throw new Error('post not found')

    await userCollection.updateOne(user, {
      $set: {
        liked_posts: [...user.liked_posts, postId]
      }
    })

    return {
      message: 'post successfully liked'
    }
  }
}