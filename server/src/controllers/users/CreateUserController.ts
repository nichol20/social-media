import { Request, Response } from "express";
import { PORT } from "../../server";
import { CreateUserService } from "../../services/users/CreateUserService";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { email, password, name } = req.body
    const { file } = req
    let imageLink: string
    let imagePath: string

    if(!email || !password || !name || !file) return res.status(400).json({ message: 'missing data' })

    if(PORT === '6000') {
      imageLink = `http://localhost:5000/test_images/users/${file.filename}`
      imagePath = `test_images/users/${file.filename}`
    } else {
      imageLink = `http://localhost:5000/images/users/${file.filename}`
      imagePath = `images/users/${file.filename}`
    }
    
    try {
      const service = new CreateUserService
      const result = await service.execute({
        name,
        email,
        password,
        image: imageLink,
        image_path: imagePath
      })

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'Email already exists') return res.status(409).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}