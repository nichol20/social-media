import { request } from "../../tests/setup"


describe("Delete like", () => {
  const user = {
    name: 'deletelike user test',
    email: 'deletelikeuser@test.com',
    password: 'deletelikeusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'deletelike post test',
    image: '__tests__/test_image.png'
  }

  it("should delete a like", async () => {
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

    await request
      .post(`/posts/${postId}/like`)
      .set({ 'Authorization': `Bearer ${token}` })

    const { body } = await request
      .delete(`/posts/${postId}/like`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(body.message).toBe('like successfully removed')
  })
})