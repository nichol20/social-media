import { Request, Response } from "express";
import { DeleteUserService } from "../../services/users/DeleteUserService";

export class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params
    const { author } = req

    // Check if the requester has permission
    if(author!.id !== id) return res.status(403).json({ message: 'you do not have permission to do this' })

    try {
      const service = new DeleteUserService
      const result = await service.execute(id)

      return res.status(200).json({ message: 'successfully deleted' })
    } catch (error: any) {
      if(error.message === 'user not found') return res.status(404).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    } 
  }
}