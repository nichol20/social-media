import { Db, MongoClient } from "mongodb";
import { PORT } from "./server";

const uri = `mongodb://mongo:27017/`
const client = new MongoClient(uri)

type Callback = (err?: any) => void

let dbConnection : Db

export default {
  connectToServer: (callback: Callback) => {
    client.connect((err, db) => {
      if(err || !db) return callback(err)
      
      if(PORT == '5000') dbConnection = db.db('social_media')
      else if(PORT == '6000') {
        dbConnection = db.db('social_media_test')
        console.log('test server')
      } else {
        throw new Error('configure the port')
      }

      console.log(`Successfully connected to MongoDB.`)

      return callback()
    })
  },

  getDb: () => dbConnection
}
