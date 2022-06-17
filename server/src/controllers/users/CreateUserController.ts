import { Request, Response } from "express";
import { CreateUserService } from "../../services/users/CreateUserService";

export class CreateUserController {
  async handle(req: Request, res: Response) {

    const { email, password, name } = req.body
    const { file } = req

    if(!email || !password || !name || !file) return res.status(400).json({ message: 'missing data' })
    
    try {
      const service = new CreateUserService
      const result = await service.execute({
        name,
        email,
        password,
        image: `http://localhost:5000/images/users/${file.filename}`
      })

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'Email already exists') return res.status(409).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}