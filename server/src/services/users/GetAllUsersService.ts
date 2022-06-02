import db from "../../db";

export class GetAllUsersService {
  async execute() {
    const usersCollection = db.getDb().collection('users')
    
    return await usersCollection.find().toArray()
  }
}