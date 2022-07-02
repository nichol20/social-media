import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'
import db from "../../db";

export class DeleteUserService {
  async execute(id: string) {
    // Find user in database
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })

    // case user not found
    if(!user) throw new Error('user not found')

    // Delete image from directory
    if(user.image_path.length > 0) {
      fs.unlink(path.resolve('src', user.image_path), err => {
        if(err) console.log(err)
      })
    }

    // Delete user from database
    await userCollection.deleteOne(user)

    return { message: 'successfully deleted' }
  }
}