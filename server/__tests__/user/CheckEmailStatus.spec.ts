import { request } from '../../tests/setup'

describe("Check email status", () => {
  const user = {
    name: 'checkemailstatus user test',
    email: 'checkemailstatususer@test.com',
    password: 'checkemailstatususertest123',
    avatar: '__tests__/test_image.png'
  }

  it("should receive 'registered'", async () => {
    await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const { body: { emailStatus } } = await request
      .post('/users/check-email-status')
      .send({ email: user.email })

    expect(emailStatus).toBe('registered')
  }) 

  it("should receive 'not registered'", async () => {
    const { body: { emailStatus } } = await request
      .post('/users/check-email-status')
      .send({ email: user.email })

    expect(emailStatus).toBe('not registered')
  }) 
})