import { request } from "../../tests/setup";

describe("Login", () => {
  const user = {
    name: 'login user test',
    email: 'loginuser@test.com',
    password: 'loginusertest123',
    image: '__tests__/test_image.png'
  }

  it("should login", async () => {
    await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const { body } = await request
      .post('/login')
      .send({ email: user.email, password: user.password })

    expect(body).toHaveProperty('token')
  })
})