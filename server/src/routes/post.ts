import express from 'express'

import { postUpload } from '../multerConfig'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { CreatePostController } from '../controllers/posts/CreatePostController'
import { DeletePostController } from '../controllers/posts/DeletePostController'
import { GetAllPostsController } from '../controllers/posts/GetAllPostsController'
import { GetPostController } from '../controllers/posts/GetPostController'
import { UpdatePostController } from '../controllers/posts/UpdatePostController'
import { CreateCommentController } from '../controllers/posts/CreateCommentController'
import { LikePostController } from '../controllers/posts/LikePostController'
import { DeleteLikeController } from '../controllers/posts/DeleteLikeController'
import { DeleteCommentController } from '../controllers/posts/DeleteCommentController'
import { EditCommentController } from '../controllers/posts/EditCommentController'

const postRoutes = express.Router()
const uploadSingleImage = postUpload.single('image')

/* --------------------------------- GET --------------------------------- */

postRoutes.get('/posts', ensureAuthenticated, new GetAllPostsController().handle)

postRoutes.get('/posts/:id', ensureAuthenticated, new GetPostController().handle)

/* --------------------------------- POST --------------------------------- */

postRoutes.post('/posts', ensureAuthenticated, (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new CreatePostController().handle(req, res)
  })
})

postRoutes.post('/posts/:postId/comments', ensureAuthenticated, new CreateCommentController().handle)

postRoutes.post('/posts/:postId/like', ensureAuthenticated, new LikePostController().handle)

/* --------------------------------- PATCH --------------------------------- */

postRoutes.patch('/posts/:id', ensureAuthenticated, (req, res) => {
  uploadSingleImage(req, res, async err => {
    if(err) return res.status(400).json({ message: err.message })
    new UpdatePostController().handle(req, res)
  })
})

postRoutes.patch('/posts/:postId/comments/:commentId', ensureAuthenticated, new EditCommentController().handle)

/* --------------------------------- DELETE --------------------------------- */

postRoutes.delete('/posts/:postId/comments/:commentId', ensureAuthenticated, new DeleteCommentController().handle)

postRoutes.delete('/posts/:postId/like', ensureAuthenticated, new DeleteLikeController().handle)

postRoutes.delete('/posts/:id', ensureAuthenticated, new DeletePostController().handle)

export { postRoutes }
