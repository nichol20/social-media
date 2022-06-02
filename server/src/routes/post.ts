import express from 'express'

import { postUpload } from '../multerConfig'
import { CreatePostController } from '../controllers/posts/CreatePostController'
import { DeletePostController } from '../controllers/posts/DeletePostController'
import { GetAllPostsController } from '../controllers/posts/GetAllPostsController'
import { GetPostController } from '../controllers/posts/GetPostController'
import { UpdatePostController } from '../controllers/posts/UpdatePostController'

const postRoutes = express.Router()
const uploadSingleImage = postUpload.single('image')

postRoutes.get('/posts', new GetAllPostsController().handle)

postRoutes.get('/posts/:id', new GetPostController().handle)

postRoutes.post('/posts', (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new CreatePostController().handle(req, res)
  })
})

postRoutes.patch('/posts/:id', (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new UpdatePostController().handle(req, res)
  })
})

postRoutes.delete('/posts/:id', new DeletePostController().handle)

export { postRoutes }
