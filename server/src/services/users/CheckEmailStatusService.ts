import db from "../../db";

export class CheckEmailStatusService {
  async execute(email: string) {
    const userCollection = db.getDb().collection('users')
    const user = await userCollection.findOne({ email })

    if(user) return ({ emailStatus: 'registered' })
    else return ({ emailStatus: 'not registered' })
  }
}