import { Db, MongoClient, ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Create post", () => {
  const userIds: string[] = []
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'createpost user test',
    email: 'createpostuser@test.com',
    password: 'createpostusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'create post test',
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
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    userIds.push(userId)

    const response = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('description', post.description)
      .attach('image', post.image)

    const postCollection = db.collection('posts')
    const createdPost = await postCollection.findOne({ _id: new ObjectId(response.body._id) })
    
    expect(createdPost?.description).toBe(post.description)
    expect(createdPost?.author_id).toBe(userId)
    expect(response.status).toBe(200)
  })

  it("should get the error 'missing data'", async () => {
    const { body: { token, user: { _id } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    userIds.push(_id)

    const response = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      
    expect(response.body.message).toBe('missing data')
    expect(response.status).toBe(400)
  })
})