import { Db, MongoClient } from 'mongodb'
import supertest from 'supertest'
import path from 'path'
import fs from 'fs'

export let db: Db
let connection: MongoClient
export const request = supertest('http://localhost:6000')

beforeAll(async () => {
  connection = await MongoClient.connect(`mongodb://localhost:27017`)
  db = connection.db('social_media_test')
})

afterEach(async () => {
  //Cleaning database
  const collections = await db.collections()
  for(let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await connection.close()

  //Removing test images
  const userImages = fs.readdirSync(path.resolve('src/test_images/users'))
  userImages.forEach(file => {
    fs.unlink(path.resolve('src/test_images/users', file), err => {
      if(err) console.log(err)
    })
  })
  const postImages = fs.readdirSync(path.resolve('src/test_images/posts'))
  postImages.forEach(file => {
    fs.unlink(path.resolve('src/test_images/posts', file), err => {
      if(err) console.log(err)
    })
  })
})
