import { ObjectId } from 'mongodb'
import { db, request } from '../../tests/setup'

describe("Create post", () => {
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

  it("should create a post", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

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
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      
    expect(response.body.message).toBe('missing data')
    expect(response.status).toBe(400)
  })
})