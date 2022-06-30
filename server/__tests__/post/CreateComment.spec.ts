import { request } from "../../tests/setup"


describe("Create comment", () => {
  const user = {
    name: 'createcomment user test',
    email: 'createcommentuser@test.com',
    password: 'createcommentusertest123',
    image: '__tests__/test_image.png'
  }
  const post = {
    description: 'createcomment post test',
    image: '__tests__/test_image.png'
  }
  const comment = {
    message: 'create comment test'
  }

  it("should create a comment", async () => {
    const { body: { token, user: { _id: userId } } } = await request
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

    const { body, status } = await request
      .post(`/posts/${postId}/comments`)
      .set({ 'Authorization': `Bearer ${token}` })
      .send({ comment: comment.message })

    expect(body.comment.message).toBe(comment.message)
    expect(body.comment.author_id).toBe(userId)
    expect(status).toBe(200)
  })
})