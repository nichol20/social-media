import { Request, Response } from "express";
import { GetPostService } from "../../services/posts/GetPostService";


export class GetPostController {
  async handle(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new GetPostService
      const result = await service.execute(id)

      res.status(200).json(result)
    } catch (error: any) {
      res.status(400).json({ message: error.message })      
    }
  }
}