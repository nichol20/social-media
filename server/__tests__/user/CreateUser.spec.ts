import { request } from '../../tests/setup'

describe("Create user", () => {
  const user = {
    name: 'create user test',
    email: 'createuser@test.com',
    password: 'createusertest123',
    image: '__tests__/test_image.png'
  }

  it("should create a user", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    expect(response.body).toHaveProperty('token')
    expect(response.body.user.name).toBe(user.name)
    expect(response.body.user.email).toBe(user.email)
    expect(response.body.user).toHaveProperty('created_at')
    expect(response.status).toBe(200)
    
  })

  it("should get the error 'Email already exists'", async () => {
    await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', user.image)

    
    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Email already exists')
  })

  it("should get the error 'missing data'", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('missing data')
  })

  it("should get the error 'Invalid mime type'", async () => {
    const response = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('image', '__tests__/test_image.ico')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid mime type')
  })
})