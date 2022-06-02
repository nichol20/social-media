import { ObjectId } from "mongodb";
import db from "../../db";

export class GetPostService {
  async execute(id: string) {
    const postsCollection = db.getDb().collection('posts')

    return await postsCollection.findOne({ _id: new ObjectId(id) })
  }
}