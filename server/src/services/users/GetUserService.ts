import { ObjectId } from "mongodb";
import db from "../../db";

export class GetUserService {
  async execute(id: string) {
    // Find user in database
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })

    // Case user not found
    if(!user) throw new Error('user not found')

    // Filter data
    const { password, ...data } = user

    return data
  }
}