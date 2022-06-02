import { Db, MongoClient, ObjectID, ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Get post", () => {
  const userIds: string[] = []
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'getpost user test',
    email: 'getpostuser@test.com',
    password: 'getpostusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'get post test',
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

  it("should fetch a specific post", async () => {
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

    const response = await request.get(`/posts/${postId}`)

    expect(response.body.description).toBe(post.description)
    expect(response.body).toHaveProperty('image_name')
    expect(response.body).toHaveProperty('created_at')
    expect(response.status).toBe(200)
  })

})