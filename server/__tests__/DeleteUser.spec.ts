import { Db, MongoClient } from "mongodb"
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
    await connection.close();
  })

  it("should delete a user", async () => {
    const { body: { insertedId } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .delete(`/users/${insertedId}`)

    expect(response.body.deletedCount).toBe(1)
    expect(response.status).toBe(200)
  })
  
  it("should not found the user", async () => {
    const response = await request.delete(`/users/62977b2dc2517038801e2183`)

    expect(response.body.message).toBe('user not found')
    expect(response.status).toBe(404)
  })
})