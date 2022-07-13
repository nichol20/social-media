import express from 'express'

import { userUpload } from '../multerConfig'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { CreateUserController } from '../controllers/users/CreateUserController'
import { DeleteUserController } from '../controllers/users/DeleteUserController'
import { GetAllUsersController } from '../controllers/users/GetAllUsersController'
import { GetUserController } from '../controllers/users/GetUserController'
import { UpdateUserController } from '../controllers/users/UpdateUserController'
import { LoginController } from '../controllers/users/LoginController'
import { CheckEmailStatusController } from '../controllers/users/CheckEmailStatusController'
import { UpdateEmailController } from '../controllers/users/UpdateEmailController'
import { UpdatePasswordController } from '../controllers/users/UpdatePasswordController'

const userRoutes = express.Router()
const uploadSingleImage = userUpload.single('avatar')
const profileUpload = userUpload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover_photo', maxCount: 1 }])

/* --------------------------------- GET --------------------------------- */

userRoutes.get('/users', ensureAuthenticated, new GetAllUsersController().handle)

userRoutes.get('/users/:id', ensureAuthenticated, new GetUserController().handle)

/* --------------------------------- POST --------------------------------- */

userRoutes.post('/login', new LoginController().handle)

userRoutes.post('/users', (req, res) => {
  uploadSingleImage(req, res, err => {
    if(err) return res.status(400).json({ message: err.message })
    new CreateUserController().handle(req, res)
  })
})

userRoutes.post('/users/check-email-status', new CheckEmailStatusController().handle)

/* --------------------------------- PUT --------------------------------- */
userRoutes.put('/users/:userId/change-email', ensureAuthenticated, new UpdateEmailController().handle)

userRoutes.put('/users/:userId/change-password', ensureAuthenticated, new UpdatePasswordController().handle)

/* --------------------------------- PATCH --------------------------------- */

userRoutes.patch('/users/:id', ensureAuthenticated, (req, res) => {
  profileUpload(req, res, err => {
    if(err) return res.status(400).json({ message: err.message })
    new UpdateUserController().handle(req, res)
  })
})

/* --------------------------------- DELETE --------------------------------- */

userRoutes.delete('/users/:id', ensureAuthenticated, new DeleteUserController().handle)

export { userRoutes }