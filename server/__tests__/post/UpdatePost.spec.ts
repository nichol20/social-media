import { ObjectId } from 'mongodb'
import { db, request } from '../../tests/setup'

describe("Update posts", () => {
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

  it("should update a post", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

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