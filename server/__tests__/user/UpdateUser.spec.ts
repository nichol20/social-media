import { ObjectId } from 'mongodb'
import { db, request } from '../../tests/setup'

describe("Update user", () => {
  const user = {
    name: 'update user test',
    email: 'updateuser@test.com',
    password: 'updateusertest123',
    avatar: '__tests__/test_image.png'
  }
  const newUserData = {
    name: 'newdata user test',
    email: 'newuserdata@test.com',
    password: 'newuserdatatest123'
  }

  it("should update a user", async () => {
    const { body: { token, user: { _id } } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const response = await request
      .patch(`/users/${ _id }`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('name', newUserData.name)

    const userCollection = db.collection('users')
    const updatedUser =  await userCollection.findOne({ _id: new ObjectId(_id) })

    expect(updatedUser?.name).toBe(newUserData.name)
    expect(response.body.message).toBe('successfully updated')
    expect(response.status).toBe(200)
  })

  it("should not have permission to update the user", async () => {
    const { body: { token } } = await request
      .post('/users')
      .field('name', user.name)
      .field('email', user.email)
      .field('password', user.password)
      .attach('avatar', user.avatar)

    const response = await request
      .patch(`/users/62977b2dc2517038801e2183`)
      .set({ 'Authorization': `Bearer ${token}` })
      .field('name', newUserData.name)

      expect(response.body.message).toBe('you do not have permission to do this')
      expect(response.status).toBe(403)
  })
})