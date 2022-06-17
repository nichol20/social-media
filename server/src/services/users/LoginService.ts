import db from "../../db";
import jwt from "jsonwebtoken";

export class LoginService {
  async execute(email: string, password: string) {
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ email, password })

    if(!user) throw new Error('user not found')

    const token = jwt.sign({}, process.env.JWT_SECRET!, { subject: String(user._id), expiresIn: '1d' })

    return { token } 
  }
}