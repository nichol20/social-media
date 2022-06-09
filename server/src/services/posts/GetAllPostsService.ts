import db from "../../db";

export class GetAllPostsService {
  async execute() {
    const postCollection = db.getDb().collection('posts')

    return await postCollection.find().toArray()
  }
}