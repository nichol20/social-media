import { request } from '../../tests/setup'

describe("Delete a user", () => {
  const user = {
    name: 'delete user test',
    email: 'deleteuser@test.com',
    password: 'deleteusertest123',
    image: '__tests__/test_image.png'
  }

  it("should delete a user", async () => {
    const { body: { token, user: { _id } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .delete(`/users/${_id}`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.message).toBe('successfully deleted')
    expect(response.status).toBe(200)
  })
  
  it("should not have permission to delete the user", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)
    
    const response = await request
      .delete(`/users/62977b2dc2517038801e2183`)
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.message).toBe('you do not have permission to do this')
    expect(response.status).toBe(403)
  })
})