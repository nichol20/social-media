import { ObjectId } from "mongodb";
import db from "../../db";

interface Data {
  name?: string
  email?: string
  password?: string
  image_name?: string
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
        image_name: data.image_name ?? user.image_name
      }
    })
  }
}