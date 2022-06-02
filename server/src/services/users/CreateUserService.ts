import db from "../../db";

interface User {
  name: string
  email: string
  password: string
  image_name: string
}

export class CreateUserService {
  async execute(user: User) {
    const usersCollection = db.getDb().collection('users')

    if(await usersCollection.findOne({ email: user.email })) throw new Error('Email already exists')

    return await usersCollection.insertOne({
      ...user,
      created_at: Date.now()
    })
  }
}