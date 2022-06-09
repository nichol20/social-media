import { Db, MongoClient } from "mongodb"
import fs from 'fs'
import path from 'path'
import supertest from 'supertest'

describe("Delete a user", () => {
  let connection: MongoClient
  let db: Db
  const request = supertest('http://localhost:6000')
  const user = {
    name: 'delete user test',
    email: 'deleteuser@test.com',
    password: 'deleteusertest123',
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

  it("should delete a user", async () => {
    const { body: { token, user: { _id } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .delete(`/users/${_id}`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.message).toBe('successfully deleted')
    expect(response.status).toBe(200)
  })
  
  it("should not have permission to delete the user", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)
    
    const response = await request
      .delete(`/users/62977b2dc2517038801e2183`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.message).toBe('you do not have permission to do this')
    expect(response.status).toBe(403)
  })
})