import { Request, Response } from "express";
import { GetUserService } from "../../services/users/GetUserService";

export class GetUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new GetUserService
      const result = await service.execute(id)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}