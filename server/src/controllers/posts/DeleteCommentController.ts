import { Request, Response } from "express";
import { DeleteCommentService } from "../../services/posts/DeleteCommentService";

export class DeleteCommentController {
  async handle(req: Request, res: Response) {
    const { postId, commentId } = req.params

    try {
      const service = new DeleteCommentService
      const result = await service.execute(postId, commentId)

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}