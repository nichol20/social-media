import { request } from '../../tests/setup'

describe("Get all posts", () => {
  const user = {
    name: 'getallposts user test',
    email: 'getallpostsuser@test.com',
    password: 'getallpostsusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'get all posts test',
    image: '__tests__/test_image.png'
  }

  it("should get all posts", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)

    await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('author_id', userId)
      .field('description', post.description)
      .attach('image', post.image)


    const response = await request
      .get('/posts')
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.length).toBe(2)
  })

})