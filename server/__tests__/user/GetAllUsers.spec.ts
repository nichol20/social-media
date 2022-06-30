import { request } from '../../tests/setup'

describe("Get all users", () => {
  const user = {
    name: 'getall user test',
    email: 'getalluser@test.com',
    password: 'getallusertest123',
    image: '__tests__/test_image.png'
  }
  const user2 = {
    name: 'getall2 user test',
    email: 'getall2user@test.com',
    password: 'getall2usertest123',
    image: '__tests__/test_image.png'
  }

  it("should get all users", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    await request
      .post('/users')
      .field('name', user2.name)
      .field('email', user2.email)
      .field('password', user2.password)
      .attach('image', user2.image)

    const response = await request.get('/users')
      .set({ 'Authorization': `Bearer ${token}` })

    expect(response.body.length).toBe(2)
  })

})