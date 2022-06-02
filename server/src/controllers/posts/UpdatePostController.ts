import { Request, Response } from "express";
import { UpdatePostService } from "../../services/posts/UpdatePostService";

export class UpdatePostController {
  async handle(req: Request, res: Response) {

    const { id } = req.params
    const { description } = req.body

    try {
      const service = new UpdatePostService
      const result = await service.execute(id, { description })

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'post not found') return res.status(404).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}