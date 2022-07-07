import { request } from '../../tests/setup'

describe("Delete post", () => {
  const user = {
    name: 'deletepost user test',
    email: 'deletepostuser@test.com',
    password: 'deletepostusertest123',
    avatar: '__tests__/test_image.png'
  }
  const post = {
    description: 'delete post test',
    image: '__tests__/test_image.png'
  }

  it("should delete a post", async () => {
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
      .delete(`/posts/${postId}`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.message).toBe('successfully deleted')
    expect(response.status).toBe(200)
  })
})