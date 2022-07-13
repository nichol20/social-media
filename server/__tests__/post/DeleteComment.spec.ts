import { request } from "../../tests/setup"


describe("Delete comment", () => {
  const user = {
    name: 'deletecomment user test',
    email: 'deletecommentuser@test.com',
    password: 'deletecommentusertest123',
    avatar: '__tests__/test_image.png'
  }
  const post = {
    description: 'deletecomment post test',
    image: '__tests__/test_image.png'
  }
  const comment = {
    message: 'delete comment test'
  }

  it("should delete a comment", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const { body: { _id: postId } } = await request
      .post('/posts')
      .set({ 'Authorization': `Bearer ${token}` })
      .field('description', post.description)
      .attach('image', post.image)

    const { body: { id: commentId } } = await request
      .post(`/posts/${postId}/comments`)
      .set({ 'Authorization': `Bearer ${token}` })
      .send({ comment: comment.message })

    const { body } = await request
      .delete(`/posts/${postId}/comments/${commentId}`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(body.message).toBe('comment successfully deleted')
  })
})