import { Db, MongoClient } from "mongodb"
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Get all users", () => {
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'getall user test',
    email: 'getalluser@test.com',
    password: 'getallusertest123',
    image: '__tests__/test_image.png'
  }
  const user2 = {
    name: 'getall2 user test',
    email: 'getall2user@test.com',
    password: 'getall2usertest123',
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
    await connection.close();

    //Removing test images
    const filenames = fs.readdirSync(path.resolve('src/images/users'))
    filenames.forEach(file => {
      if(file.includes(user.email) || file.includes(user2.email)) {
        fs.unlink(path.resolve('src/images/users', file), err => {
          if(err) console.log(err)
        })
      }
    })
  })

  it("should get all users", async () => {
    await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    await request
      .post('/users')
      .field('name', user2.name)
      .field('email', user2.email)
      .field('password', user2.password)
      .attach('image', user2.image)

    const response = await request.get('/users')

    expect(response.body.length).toBe(2)
  })

})