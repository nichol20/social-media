import { Request, Response } from "express";
import { CheckEmailStatusService } from "../../services/users/CheckEmailStatusService";

export class CheckEmailStatusController {
  async handle(req: Request, res: Response) {
    const { email } = req.body
    
    try {
      const service = new CheckEmailStatusService
      const result = await service.execute(email)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}