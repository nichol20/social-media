import { ObjectId } from "mongodb";
import db from "../../db";

interface Data {
  description?: string
  image_name?: string
}

export class UpdatePostService {
  async execute(id: string, data: Data) {
    const postsCollection = db.getDb().collection('posts')
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })

    if(!post) throw new Error('post not found')

    if(!data.description) data.description = post.description

    return await postsCollection.updateOne(post, {
      $set: {
        ...data
      }
    })
  }
}