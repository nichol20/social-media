import { request } from '../../tests/setup'

describe("Get post", () => {
  const user = {
    name: 'getpost user test',
    email: 'getpostuser@test.com',
    password: 'getpostusertest123',
    avatar: '__tests__/test_image.png'
  }
  const post = {
    description: 'get post test',
    image: '__tests__/test_image.png'
  }

  it("should fetch a specific post", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const { body: { _id: postId } } = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)

    const response = await request
      .get(`/posts/${postId}`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.description).toBe(post.description)
    expect(response.body).toHaveProperty('created_at')
    expect(response.status).toBe(200)
  })

})