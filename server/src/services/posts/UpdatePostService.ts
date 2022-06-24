import { ObjectId } from "mongodb";
import db from "../../db";

interface Data {
  description?: string
  image_name?: string
}

export class UpdatePostService {
  async execute(id: string, data: Data, author_id: string) {
    const postCollection = db.getDb().collection('posts')
    const post = await postCollection.findOne({ _id: new ObjectId(id) })

    if(!post) throw new Error('post not found')

    if(author_id !== post.author_id) throw new Error('You do not have permission to do this')

    await postCollection.updateOne(post, {
      $set: {
        description: data.description ?? post.description
      }
    })
  }
}