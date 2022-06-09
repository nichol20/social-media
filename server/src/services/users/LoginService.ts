import db from "../../db";
import jwt from "jsonwebtoken";

export class LoginService {
  async execute(email: string, password: string) {
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ email, password })

    if(!user) throw new Error('user not found')

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    return { token, user } 
  }
}