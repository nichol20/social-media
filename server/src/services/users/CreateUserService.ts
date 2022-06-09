import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'
import db from "../../db";

interface User {
  name: string
  email: string
  password: string
  image_name: string
}

export class CreateUserService {
  async execute(user: User) {
    const userCollection = db.getDb().collection('users')

    if(await userCollection.findOne({ email: user.email })) throw new Error('Email already exists')

    const { insertedId } = await userCollection.insertOne({
      ...user,
      created_at: Date.now(),
      posts: []
    })

    const newUser = await userCollection.findOne({ _id: new ObjectId(insertedId) })
    const { password, ...data } = newUser!
    
    const token = jwt.sign({ userId: newUser?._id }, process.env.JWT_SECRET!)
    return {
      token,
      user: data
    }
  }
}