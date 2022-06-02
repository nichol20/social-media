import { Db, MongoClient } from "mongodb";
import { PORT } from "./server";

const uri = `mongodb://localhost:27017`
const client = new MongoClient(uri)

type Callback = (err?: any) => void

let dbConnection : Db

export default {
  connectToServer: (callback: Callback) => {
    client.connect((err, db) => {
      if(err || !db) return callback(err)

      if(PORT === '5000') dbConnection = db.db('social_media')
      if(PORT === '6000') {
        dbConnection = db.db('social_media_test')
        console.log('test server')
      }

      console.log(`Successfully connected to MongoDB.`)

      return callback()
    })
  },

  getDb: () => dbConnection,

  client
}
