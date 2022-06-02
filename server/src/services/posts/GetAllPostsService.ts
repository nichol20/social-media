import db from "../../db";

export class GetAllPostsService {
  async execute() {
    const postsCollection = db.getDb().collection('posts')

    return await postsCollection.find().toArray()
  }
}