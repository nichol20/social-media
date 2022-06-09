import db from "../../db";

export class GetAllUsersService {
  async execute() {
    // Get all users in database
    const userCollection = db.getDb().collection('users')
    const users = await userCollection.find().toArray()

    // Filter data and return
    return users.map(user => {
      const { password, ...filteredData } = user

      return filteredData
    })
  }
}