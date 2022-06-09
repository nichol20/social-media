import { Db, MongoClient, ObjectID, ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Update posts", () => {
  const userIds: string[] = []
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'updatepost user test',
    email: 'updatepostuser@test.com',
    password: 'updatepostusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'update post test',
    image: '__tests__/test_image.png'
  }
  const newPostData = {
    description: 'updated post'
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

  it("should update a post", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    userIds.push(userId)

    const { body: { _id: postId } } = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)


    const response = await request
      .patch(`/posts/${postId}`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('description', newPostData.description)

    const postCollection = db.collection('posts')
    const updatedPost = await postCollection.findOne({ _id: new ObjectId(postId) })

    expect(updatedPost?.description).toBe(newPostData.description)
    expect(updatedPost).toHaveProperty('created_at')
    expect(response.status).toBe(200)
  })

  it("should not update the image", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    userIds.push(userId)

    const { body: { insertedId: postId } } = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)
    

    const response = await request
      .patch(`/posts/${postId}`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('description', newPostData.description)
      .attach('image', post.image)

    expect(response.body.message).toBe("it's not allowed to update the image, please create another post")
    expect(response.status).toBe(400)
  })
})