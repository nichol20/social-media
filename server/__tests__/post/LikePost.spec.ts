import { request } from "../../tests/setup"


describe("Like post", () => {
  const user = {
    name: 'likepost user test',
    email: 'likepostuser@test.com',
    password: 'likepostusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'like post test',
    image: '__tests__/test_image.png'
  }

  it("should like a post", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const { body: { _id: postId } } = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('description', post.description)
      .attach('image', post.image)

    const { body } = await request
      .post(`/posts/${postId}/like`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(body.message).toBe('post successfully liked')
  })
})