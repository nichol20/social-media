import { request } from '../../tests/setup'

describe("Get user", () => {
  const user = {
    name: 'get user test',
    email: 'getuser@test.com',
    password: 'getusertest123',
    image: '__tests__/test_image.png'
  }

  it("should fetch a specific user", async () => {
    const { body: { token, user: { _id } }} = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request.get(`/users/${_id}`)
      .set({ 'Authorization': `Bearer ${token}`})
    
    expect(response.status).toBe(200)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body).toHaveProperty('created_at')
  })
})