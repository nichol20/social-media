import { Db, MongoClient } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Get user", () => {
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'get user test',
    email: 'getuser@test.com',
    password: 'getusertest123',
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
    const filenames = fs.readdirSync(path.resolve('src/images/users'))
    filenames.forEach(file => {
      if(file.includes(user.email)) {
        fs.unlink(path.resolve('src/images/users', file), err => {
          if(err) console.log(err)
        })
      }
    })
  })

  it("should fetch a specific user", async () => {
    const { body: { token, user: { _id } }} = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request.get(`/users/${_id}`)
      .set({ 'Authorization': `Bearer ${token}`})
    
    expect(response.status).toBe(200)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body).toHaveProperty('created_at')
  })
})