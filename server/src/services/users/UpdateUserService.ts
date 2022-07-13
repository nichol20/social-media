import { ObjectId } from "mongodb";
import fs from 'fs'
import path from 'path'

import db from "../../db";

interface Data {
  name?: string
  avatar?: string
  avatar_path?: string
  cover_photo?: string
  cover_photo_path?: string
}

export class UpdateUserService {
  async execute(id: string, data: Data) {
    // Find user in database
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })

    // case user not found
    if(!user) throw new Error('user not found')

    // Update user in database
    await userCollection.updateOne(user, {
      $set: {
        name: data.name ?? user.name,
        avatar: data.avatar ?? user.avatar,
        avatar_path: data.avatar_path ?? user.avatar_path,
        cover_photo: data.cover_photo ?? user.cover_photo,
        cover_photo_path: data.cover_photo_path ?? user.cover_photo_path,
      }
    })

    if(user.avatar_path.length > 0) {
      fs.unlink(path.resolve('src', user.avatar_path), err => {
        if(err) console.log(err)
      })
    }
    if(user.cover_photo_path.length > 0) {
      fs.unlink(path.resolve('src', user.cover_photo_path), err => {
        if(err) console.log(err)
      })
    }

    return { message: 'successfully updated'}
  }
}