import { Request, Response } from "express";
import { CreateCommentService } from "../../services/posts/CreateCommentService";

export class CreateCommentController {
  async handle(req: Request, res: Response) {

    const { postId } = req.params
    const { author } = req
    const { comment } = req.body

    if(!comment) return res.status(400).json({ message: 'missing data' })
    
    try {
      const service = new CreateCommentService
      const result = await service.execute(postId, {
        message: comment,
        author_id: author!.id
      })

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}