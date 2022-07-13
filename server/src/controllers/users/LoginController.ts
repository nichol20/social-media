import { Request, Response } from "express";
import { LoginService } from "../../services/users/LoginService";

export class LoginController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body

    if(!email || !password) return res.status(400).json({ message: 'missing data' })  

    try {
      const service = new LoginService
      const result = await service.execute(email, password)

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'user not found') return res.status(404).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}