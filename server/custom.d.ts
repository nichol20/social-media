import { Author } from "./src/middlewares/ensureAuthenticated";

declare global {
  namespace Express {
    export interface Request {
      author?: Author
    }
  }
}