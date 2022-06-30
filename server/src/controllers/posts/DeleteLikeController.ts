import { Request, Response } from "express";
import { DeleteLikeService } from "../../services/posts/DeleteLikeService";

export class DeleteLikeController {
  async handle(req: Request, res: Response) {
    const { postId } = req.params
    const { author } = req

    try {
      const service = new DeleteLikeService
      const result = await service.execute(postId, author!.id)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}