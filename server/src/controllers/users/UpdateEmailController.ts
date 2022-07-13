import { Request, Response } from "express";
import { UpdateEmailService } from "../../services/users/UpdateEmailService";

export class UpdateEmailController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body
    const { userId}  = req.params
    const { author } = req

    console.log(email, password)

    if(!email || !password) return res.status(400).json({ message: 'Bad request' })
    if(userId !== author!.id) return res.status(403).json({ message: 'You do not have permission to do this' })

    try {
      const service = new UpdateEmailService
      const result = await service.execute(email, password, userId)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}