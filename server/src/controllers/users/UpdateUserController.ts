import { Request, Response } from "express";
import { UpdateUserService } from "../../services/users/UpdateUserService";

export class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params
    const { name, email, password } = req.body
    const { file, author } = req
    
    // Check if the requester has permission
    if(author!.id !== id) return res.status(403).json({ message: 'you do not have permission to do this' })

    try {
      const service = new UpdateUserService
      const result = await service.execute(id, {
        name: name,
        email: email,
        password: password,
        image_name: file?.filename
      })

      res.status(200).json({ message: 'successfully updated'})
    } catch (error: any) {
      if(error.message === 'user not found') return res.status(404).json({ message: error.message })
      res.status(400).json({ message: error.message })
    }
  }
}