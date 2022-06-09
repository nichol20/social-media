import express from 'express'

import { postUpload } from '../multerConfig'
import { CreatePostController } from '../controllers/posts/CreatePostController'
import { DeletePostController } from '../controllers/posts/DeletePostController'
import { GetAllPostsController } from '../controllers/posts/GetAllPostsController'
import { GetPostController } from '../controllers/posts/GetPostController'
import { UpdatePostController } from '../controllers/posts/UpdatePostController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const postRoutes = express.Router()
const uploadSingleImage = postUpload.single('image')

postRoutes.get('/posts', ensureAuthenticated, new GetAllPostsController().handle)

postRoutes.get('/posts/:id', ensureAuthenticated, new GetPostController().handle)

postRoutes.post('/posts', ensureAuthenticated, (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new CreatePostController().handle(req, res)
  })
})

postRoutes.patch('/posts/:id', ensureAuthenticated, (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new UpdatePostController().handle(req, res)
  })
})

postRoutes.delete('/posts/:id', ensureAuthenticated, new DeletePostController().handle)

export { postRoutes }
