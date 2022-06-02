import { Request, Response } from "express";
import { GetAllUsersService } from "../../services/users/GetAllUsersService";

export class GetAllUsersController {
  async handle(req: Request, res: Response) {
    try {
      const service = new GetAllUsersService
      const result = await service.execute()

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}