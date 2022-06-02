import { Db, MongoClient, ObjectID, ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Delete post", () => {
  const userIds: string[] = []
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'deletepost user test',
    email: 'deletepostuser@test.com',
    password: 'deletepostusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'delete post test',
    image: '__tests__/test_image.png'
  }

  beforeAll(async () => {
    connection = await MongoClient.connect(`mongodb://localhost:27017`)
    db = connection.db('social_media_test')
    
  })

  afterEach(async () => {
    const collections = await db.collections()
    for(let collection of collections) {
      await collection.deleteMany({})
    }
  })

  afterAll(async () => {
    await connection.close()

    //Removing test images
    const userImages = fs.readdirSync(path.resolve('src/images/users'))
    userImages.forEach(file => {
      if(file.includes(user.email)) {
        fs.unlink(path.resolve('src/images/users', file), err => {
          if(err) console.log(err)
        })
      }
    })
    const postImages = fs.readdirSync(path.resolve('src/images/posts'))
    postImages.forEach(file => {
      userIds.forEach(id => {
        if(file.includes(id)) {
          fs.unlink(path.resolve('src/images/posts', file), err => {
            if(err) console.log(err)
          })
        }
      })
    })
  })

  it("should create a post", async () => {
    const { body: { insertedId: userId } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    userIds.push(userId)
    
    const { body: { insertedId: postId } } = await request
      .post('/posts')
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)

    const response = await request
      .delete(`/posts/${postId}`)

    expect(response.body.deletedCount).toBe(1)
    expect(response.status).toBe(200)
  })

  it("should not found the post", async () => {
    const response = await request.delete(`/posts/62977b2dc2517038801e2183`)

    expect(response.body.message).toBe('post not found')
    expect(response.status).toBe(404)
  })

})