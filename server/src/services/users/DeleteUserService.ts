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
    fs.unlink(path.resolve('src/images/users', user.image_name), err => {
      if(err) console.log(err)
    })

    // Delete user from database
    await userCollection.deleteOne(user)
  }
}