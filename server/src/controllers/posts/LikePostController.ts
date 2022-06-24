import { Request, Response } from "express";
import { LikePostService } from "../../services/posts/LikePostService";

export class LikePostController {
  async handle(req: Request, res: Response) {
    const { author } = req
    const { postId } = req.params

    try {
      const service = new LikePostService
      await service.execute(postId, author!.id)

      return res.status(200).json({ message: 'post liked successfully' })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}