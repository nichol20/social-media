import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'
import db from "../../db";

export class DeleteUserService {
  async execute(id: string) {
    const usersCollection = db.getDb().collection('users')
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })

    if(!user) throw new Error('user not found')

    fs.unlink(path.resolve('src/images/users', user.image_name), err => {
      if(err) console.log(err)
    })

    return await usersCollection.deleteOne({ _id: new ObjectId(id) })
  }
}