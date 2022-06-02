import { ObjectId } from "mongodb";
import db from "../../db";

export class GetUserService {
  async execute(id: string) {
    const userCollection = db.getDb().collection('users')
    
    return await userCollection.findOne({ _id: new ObjectId(id) })
  }
}