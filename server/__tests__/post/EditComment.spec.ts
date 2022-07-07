import { request } from "../../tests/setup"


describe("Edit comment", () => {
  const user = {
    name: 'editcomment user test',
    email: 'editcommentuser@test.com',
    password: 'editcommentusertest123',
    avatar: '__tests__/test_image.png'
  }
  const post = {
    description: 'editcomment post test',
    image: '__tests__/test_image.png'
  }
  const comment = {
    message: 'edit comment test'
  }
  const newComment = {
    message: 'comment edited'
  }

  it("should edit a comment", async () => {
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

    const { body: { comment: { id: commentId }  } } = await request
      .post(`/posts/${postId}/comments`)
      .set({ 'Authorization': `Bearer ${token}` })
      .send({ comment: comment.message })

    const { body, status } = await request
      .patch(`/posts/${postId}/comments/${commentId}`)
      .set({ 'Authorization': `Bearer ${token}` })
      .send({ comment: newComment.message })

    expect(body.comment.message).toBe(newComment.message)
    expect(status).toBe(200)
  })
})