import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'
import db from "../../db";

export class DeletePostService {
  async execute(id: string) {
    const postsCollection = db.getDb().collection('posts')
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    
    if(!post) throw new Error('post not found')

    fs.unlink(path.resolve('src/images/posts',post.image_name), err => {
      if(err) console.log(err)
    })

    return await postsCollection.deleteOne(post)
  }
}