import { ObjectId } from "mongodb";
import db from "../../db";

export class GetPostService {
  async execute(id: string) {
    const postCollection = db.getDb().collection('posts')

    return await postCollection.findOne({ _id: new ObjectId(id) })
  }
}