import { Request, Response } from "express";
import { RemoveLikeService } from "../../services/posts/RemoveLikeService";

export class RemoveLikeController {
  async handle(req: Request, res: Response) {
    const { postId } = req.params
    const { author } = req

    try {
      const service = new RemoveLikeService
      await service.execute(postId, author!.id)

      return res.status(200).json({ message: 'like successfully removed' })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}