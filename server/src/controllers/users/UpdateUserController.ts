import { Request, Response } from "express";
import { UpdateUserService } from "../../services/users/UpdateUserService";

export class UpdateUserController {
  async handle(req: Request, res: Response) {

    const { id } = req.params
    const { name, email, password } = req.body
    const { file } = req

    try {
      const service = new UpdateUserService
      const result = await service.execute(id, {
        name: name,
        email: email,
        password: password,
        image_name: file?.filename
      })

      res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'user not found') return res.status(404).json({ message: error.message })
      res.status(400).json({ message: error.message })
    }
  }
}