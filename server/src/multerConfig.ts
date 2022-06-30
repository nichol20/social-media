import { Request } from 'express'
import { ObjectId } from 'mongodb'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import db from './db'
import { PORT } from './server'

const postStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if(PORT === '6000') callback(null, path.resolve('src/test_images/posts'))
    else callback(null, path.resolve('src/images/posts'))
  },
  filename: async (req, file, callback) => {

    if(req.method === 'PATCH') return callback(new Error("it's not allowed to update the image, please create another post"), '')

    if(!req.author?.id) callback(new Error('missing author id'), '')
    else callback(null, `${req.author?.id}-${Date.now()}-${file.originalname}`)
  }
})

const userStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if(PORT === '6000') callback(null, path.resolve('src/test_images/users'))
    else callback(null, path.resolve('src/images/users'))
  },
  filename: async (req, file, callback) => {
    let userEmail = req.body.email

    if(req.method === 'PATCH') {
      const userCollection = db.getDb().collection('users')
      const user = await userCollection.findOne({ _id: new ObjectId(req.params.id) })

      if(!user) return callback(new Error('user not found'), '')
      userEmail = user.email
    }

    if(!userEmail) callback(new Error('missing email'), '')
    else callback(null, `${userEmail}-${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Invalid mime type'))
  }
}

export const postUpload = multer({
  storage: postStorage,
  fileFilter
})

export const userUpload = multer({
  storage: userStorage,
  fileFilter
})