import { Request, Response } from "express";
import { EditCommentService } from "../../services/posts/EditCommentService";

export class EditCommentController {
  async handle(req: Request, res: Response) {
    const { postId, commentId } = req.params
    const { comment } = req.body
    const { author } = req

    try {
      const service = new EditCommentService
      const result = await service.execute(postId, commentId, author!.id, comment)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}