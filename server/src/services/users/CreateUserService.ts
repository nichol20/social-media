import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'
import db from "../../db";

interface User {
  name: string
  email: string
  password: string
  image: string
  image_path: string
}

export class CreateUserService {
  async execute(user: User) {
    const userCollection = db.getDb().collection('users')

    if(await userCollection.findOne({ email: user.email })) throw new Error('Email already exists')

    const { insertedId } = await userCollection.insertOne({
      ...user,
      created_at: Date.now(),
      posts: [],
      likedPosts: []
    })

    const newUser = await userCollection.findOne({ _id: new ObjectId(insertedId) })
    
    const token = jwt.sign({}, process.env.JWT_SECRET!, { subject: String(newUser?._id), expiresIn: '1d' })
    return {
      token,
      user: newUser
    }
  }
}