import { Request, Response } from "express";
import { PORT } from "../../server";
import { CreatePostService } from "../../services/posts/CreatePostService";

export class CreatePostController {
  async handle(req: Request, res: Response) {

    const { description, feeling } = req.body
    const { file, author } = req
    let imageLink: string
    let imagePath: string
    
    if(!description && !file) return res.status(400).json({ message: 'missing data' })
    
    if(PORT === '6000') {
      imageLink = `http://localhost:5000/test_images/posts/${file?.filename}`
      imagePath = `test_images/posts/${file?.filename}`
    } else {
      imageLink = `http://localhost:5000/test_images/posts/${file?.filename}`
      imagePath = `test_images/posts/${file?.filename}`
    }

    try {
      const service = new CreatePostService
      const result = await service.execute({
        description,
        feeling: feeling ?? '',
        author_id: author!.id,
        image: file ? imageLink : '',
        image_path: file ? imagePath : ''
      })

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}