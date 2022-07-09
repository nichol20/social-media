import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'
import db from "../../db";

export class DeleteUserService {
  async execute(id: string) {
    // Find user in database
    const userCollection = db.getDb().collection('users')
    const postCollection = db.getDb().collection('posts')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })

    // case user not found
    if(!user) throw new Error('user not found')

    // Delete image from directory
    if(user.avatar_path.length > 0) {
      fs.unlink(path.resolve('src', user.avatar_path), err => {
        if(err) console.log(err)
      })
    }

    user.posts.forEach(async (postId: string) => {
      const post = await postCollection.findOne({ _id: new ObjectId(postId) })

      if(!post) return
      console.log(post)
      if(post.image_path > 0)  {
        fs.unlink(path.resolve('src', post.image_path), err => {
          if(err) console.log(err)
        })
      }

      await postCollection.deleteOne(post)
    })

    // Delete user from database
    await userCollection.deleteOne(user)

    return { message: 'successfully deleted' }
  }
}