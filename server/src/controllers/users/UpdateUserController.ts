import { Request, Response } from "express";
import { PORT } from "../../server";
import { UpdateUserService } from "../../services/users/UpdateUserService";

export class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params
    const { name, email, password } = req.body
    const { author } = req
    const files= req.files as {[fieldname: string]: Express.Multer.File[]};
    let avatarLink: string | undefined
    let avatarPath: string | undefined
    let coverPhotoLink: string | undefined
    let coverPhotoPath: string | undefined
    
    // Check if the requester has permission
    if(author!.id !== id) return res.status(403).json({ message: 'you do not have permission to do this' })

    if(PORT === '6000') {
      if(files['avatar']) {
        avatarLink = `http://localhost:6000/test_images/users/${files['avatar'][0].filename}`
        avatarPath = `test_images/users/${files['avatar'][0].filename}`
      }
      if(files['cover_photo']) {
        coverPhotoLink = `http://localhost:6000/test_images/users/${files['cover_photo'][0].filename}`
        coverPhotoPath = `test_images/users/${files['cover_photo'][0].filename}`
      }
    } else {
      if(files['avatar']) {
        avatarLink = `http://localhost:5000/images/users/${files['avatar'][0].filename}`
        avatarPath = `images/users/${files['avatar'][0].filename}`
      }
      if(files['cover_photo']) {
        coverPhotoLink = `http://localhost:5000/images/users/${files['cover_photo'][0].filename}`
        coverPhotoPath = `images/users/${files['cover_photo'][0].filename}`
      }
    }

    try {
      const service = new UpdateUserService
      const result = await service.execute(id, {
        name: name,
        email: email,
        password: password,
        avatar: avatarLink,
        avatar_path: avatarPath,
        cover_photo: coverPhotoLink,
        cover_photo_path: coverPhotoPath
      })

      res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'user not found') return res.status(404).json({ message: error.message })
      res.status(400).json({ message: error.message })
    }
  }
}