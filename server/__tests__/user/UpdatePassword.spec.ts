import { ObjectId } from 'mongodb'
import { request } from '../../tests/setup'
import { db } from '../../tests/setup'

describe("Update password", () => {
  const user = {
    name: 'updatepassword user test',
    email: 'updatepassworduser@test.com',
    password: 'updatepasswordusertest123',
    avatar: '__tests__/test_image.png'
  }

  const newPassword = 'updatedpassword123'

  it("should change the user's password", async () => {
    const { body: { token, user: { _id: userId } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const response = await request
      .put(`/users/${userId}/change-password`)
      .set({ Authorization: `Berer ${token}` })
      .send({
        current_password: user.password,
        new_password: newPassword
      })

    expect(response.body.message).toBe('password successfully updated')
    expect(response.status).toBe(200)

    const userCollection = db.collection('users')
    const updatedUser = await userCollection.findOne({ _id: new ObjectId(userId) })

    expect(updatedUser?.password).toBe(newPassword)
  }) 
})