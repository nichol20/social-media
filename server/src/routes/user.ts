import express from 'express'

import { userUpload } from '../multerConfig'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { CreateUserController } from '../controllers/users/CreateUserController'
import { DeleteUserController } from '../controllers/users/DeleteUserController'
import { GetAllUsersController } from '../controllers/users/GetAllUsersController'
import { GetUserController } from '../controllers/users/GetUserController'
import { UpdateUserController } from '../controllers/users/UpdateUserController'
import { LoginController } from '../controllers/users/LoginController'

const userRoutes = express.Router()
const uploadSingleImage = userUpload.single('image')

userRoutes.post('/login', new LoginController().handle)

userRoutes.get('/users', ensureAuthenticated, new GetAllUsersController().handle)

userRoutes.get('/users/:id', ensureAuthenticated, new GetUserController().handle)

userRoutes.post('/users', (req, res) => {
  uploadSingleImage(req, res, err => {
    if(err) return res.status(400).json({ message: err.message })
    new CreateUserController().handle(req, res)
  })
})

userRoutes.patch('/users/:id', ensureAuthenticated, (req, res) => {
  uploadSingleImage(req, res, err => {
    if(err) return res.status(400).json({ message: err.message })
    new UpdateUserController().handle(req, res)
  })
})

userRoutes.delete('/users/:id', ensureAuthenticated, new DeleteUserController().handle)

export { userRoutes }