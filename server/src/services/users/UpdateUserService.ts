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
    const usersCollection = db.getDb().collection('users')
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })

    if(!user) throw new Error('user not found')

    if(!data.name) data.name = user.name
    if(!data.email) data.email = user.email
    if(!data.password) data.password = user.password
    if(!data.image_name) data.image_name = user.image_name

    return await usersCollection.updateOne(user, {
      $set: {
        ...data
      }
    })
  }
}