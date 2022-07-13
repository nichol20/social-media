import { Request, Response } from "express";
import { UpdatePasswordService } from "../../services/users/UpdatePasswordService";

export class UpdatePasswordController {
  async handle(req: Request, res: Response) {
    const { current_password, new_password } = req.body
    const { userId } = req.params
    const { author } = req

    if(!current_password || !new_password) return res.status(400).json({ message: 'Bad request' })
    if(userId !== author!.id) return res.status(403).json({ message: 'You do not have permission to do this' })

    try {
      const service = new UpdatePasswordService
      const result = await service.execute(current_password, new_password, userId)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}