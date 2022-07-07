import { Request, Response } from "express";
import { PORT } from "../../server";
import { CreateUserService } from "../../services/users/CreateUserService";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { email, password, name } = req.body
    const { file } = req
    let avatarLink: string
    let avatarPath: string

    console.log(req.body)
    console.log(file)

    if(!email || !password || !name || !file) return res.status(400).json({ message: 'missing data' })

    if(PORT === '6000') {
      avatarLink = `http://localhost:6000/test_images/users/${file.filename}`
      avatarPath = `test_images/users/${file.filename}`
    } else {
      avatarLink = `http://localhost:5000/images/users/${file.filename}`
      avatarPath = `images/users/${file.filename}`
    }
    
    try {
      const service = new CreateUserService
      const result = await service.execute({
        name,
        email,
        password,
        avatar: avatarLink,
        avatar_path: avatarPath
      })

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'Email already exists') return res.status(409).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}