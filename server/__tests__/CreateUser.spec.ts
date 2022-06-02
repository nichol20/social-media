import { Db, MongoClient } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Create user", () => {
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'create user test',
    email: 'createuser@test.com',
    password: 'createusertest123',
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

  it("should create a user", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    expect(response.body).toHaveProperty('insertedId')
    expect(response.status).toBe(200)
    
  })

  it("should get the error 'Email already exists'", async () => {
    await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    
    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Email already exists')
  })

  it("should get the error 'missing data'", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('missing data')
  })

  it("should get the error 'Invalid mime type'", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', '__tests__/test_image.ico')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid mime type')
  })
})