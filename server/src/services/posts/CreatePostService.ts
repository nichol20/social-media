import { ObjectId } from "mongodb";
import db from "../../db";

interface NewPost {
  description: string
  feeling: string
  image?: string
  author_id: string
}

export class CreatePostService {
  async execute(post: NewPost) {
    const postCollection = db.getDb().collection('posts')
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(post.author_id) })

    if(!user) throw new Error('no authenticated user was specified')

    const { insertedId } = await postCollection.insertOne({
      ...post,
      comments: [],
      created_at: Date.now()
    })

    user.posts.push(insertedId)

    await userCollection.updateOne(user, {
      $set: {
        posts: user.posts 
      }
    })

    const data = await postCollection.findOne({ _id: new ObjectId(insertedId) })

    return data
  }
}