import { Request, Response } from "express";
import { DeletePostService } from "../../services/posts/DeletePostService";


export class DeletePostController {
  async handle(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new DeletePostService
      const result = await service.execute(id)

      return res.status(200).json(result)
    } catch (error: any) {
      if(error.message === 'post not found') return res.status(404).json({ message: error.message })
      return res.status(400).json({ message: error.message })
    }
  }
}