import { ObjectId } from "mongodb";
import db from "../../db";

export class UpdateEmailService {
  async execute(newEmail: string, password: string, userId: string) {
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(userId) })

    if(!user) throw new Error('user not found')
    if(user.password !== password) throw new Error('Incorrect password')
    
    await userCollection.updateOne(user, {
      $set: {
        email: newEmail
      }
    })

    return {
      message: 'email successfully updated'
    }
  }
}