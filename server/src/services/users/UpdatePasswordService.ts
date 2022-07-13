import { ObjectId } from "mongodb";
import db from "../../db";

export class UpdatePasswordService {
  async execute(currentPassword: string, newPassword: string, userId: string) {
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(userId) })

    if(!user) throw new Error('user not found')
    if(user.password !== currentPassword) throw new Error('Incorrect password')

    await userCollection.updateOne(user, {
      $set: {
        password: newPassword
      }
    })

    return {
      message: 'password successfully updated'
    }
  }
}