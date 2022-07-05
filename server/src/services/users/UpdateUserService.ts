import { ObjectId } from "mongodb";
import db from "../../db";

interface Data {
  name?: string | undefined
  email?: string | undefined
  password?: string | undefined
  avatar?: string | undefined
  avatar_path?: string | undefined
  cover_photo?: string | undefined
  cover_photo_path?: string | undefined
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
        email: data.email ?? user.email,
        password: data.password ?? user.password,
        avatar: data.avatar ?? user.avatar,
        avatar_path: data.avatar_path ?? user.avatar_path,
        cover_photo: data.cover_photo ?? user.cover_photo,
        cover_photo_path: data.cover_photo_path ?? user.cover_photo_path,
      }
    })

    return { message: 'successfully updated'}
  }
}