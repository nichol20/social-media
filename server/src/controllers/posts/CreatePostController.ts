import { Request, Response } from "express";
import { CreatePostService } from "../../services/posts/CreatePostService";

export class CreatePostController {
  async handle(req: Request, res: Response) {

    const { description, author_id } = req.body
    const { file } = req

    if((!description && !file) || !author_id) return res.status(400).json({ message: 'missing data' })

    try {
      const service = new CreatePostService
      const result = await service.execute({
        description,
        author_id,
        image_name: file?.filename
      })

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}