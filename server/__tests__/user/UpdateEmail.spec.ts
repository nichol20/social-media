import { ObjectId } from 'mongodb'
import { request } from '../../tests/setup'
import { db } from '../../tests/setup'

describe("Update email", () => {
  const user = {
    name: 'updateemail user test',
    email: 'updateemailuser@test.com',
    password: 'updateemailusertest123',
    avatar: '__tests__/test_image.png'
  }

  const newEmail = 'updatedemail@test.com'

  it("should change the user's email", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const response = await request
      .put(`/users/${userId}/change-email`)
      .set({ Authorization: `Berer ${token}` })
      .send({
        email: newEmail,
        password: user.password
      })

    expect(response.body.message).toBe('email successfully updated')
    expect(response.status).toBe(200)

    const userCollection = db.collection('users')
    const updatedUser = await userCollection.findOne({ _id: new ObjectId(userId) })

    expect(updatedUser?.email).toBe(newEmail)
  }) 
})