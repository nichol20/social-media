import { Request, Response } from "express"
import { GetAllPostsService } from "../../services/posts/GetAllPostsService"

export class GetAllPostsController {
  async handle(req: Request, res: Response) {
    try {
      const service = new GetAllPostsService
      const result = await service.execute()

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}