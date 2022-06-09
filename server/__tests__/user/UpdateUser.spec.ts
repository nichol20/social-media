import { Db, MongoClient, ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'
import supertest from 'supertest'

describe("Update user", () => {
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'update user test',
    email: 'updateuser@test.com',
    password: 'updateusertest123',
    image: '__tests__/test_image.png'
  }
  const newUserData = {
    name: 'newdata user test',
    email: 'newuserdata@test.com',
    password: 'newuserdatatest123'
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
      if(file.includes(user.email) || file.includes(newUserData.email)) {
        fs.unlink(path.resolve('src/images/users', file), err => {
          if(err) console.log(err)
        })
      }
    })
  })

  it("should update a user", async () => {
    const { body: { token, user: { _id } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .patch(`/users/${ _id }`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('name', newUserData.name)
      .field('email', newUserData.email)
      .field('password', newUserData.password)

    const userCollection = db.collection('users')
    const updatedUser =  await userCollection.findOne({ _id: new ObjectId(_id) })

    expect(updatedUser?.name).toBe(newUserData.name)
    expect(updatedUser?.email).toBe(newUserData.email)
    expect(updatedUser?.password).toBe(newUserData.password)
    expect(response.body.message).toBe('successfully updated')
    expect(response.status).toBe(200)
  })

  it("should not have permission to update the user", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .patch(`/users/62977b2dc2517038801e2183`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('name', newUserData.name)

      expect(response.body.message).toBe('you do not have permission to do this')
      expect(response.status).toBe(403)
  })
})