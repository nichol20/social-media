import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'
import db from "../../db";

export class DeletePostService {
  async execute(id: string, author_id: string) {
    const postCollection = db.getDb().collection('posts')
    const post = await postCollection.findOne({ _id: new ObjectId(id) })
    
    if(!post) throw new Error('post not found')

    if(author_id !== post.author_id) throw new Error('You do not have permission to do this')

    fs.unlink(path.resolve('src/images/posts',post.image_name), err => {
      if(err) console.log(err)
    })

    await postCollection.deleteOne(post)
  }
}