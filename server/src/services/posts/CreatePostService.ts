import db from "../../db";

export interface Post {
  description: string
  image_name?: string
  author_id: string
}

export class CreatePostService {
  async execute(post: Post) {
    const postsCollection = db.getDb().collection('posts')

    return await postsCollection.insertOne({
      ...post,
      created_at: Date.now()
    })
  }
}