import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '../server'

export interface Author {
  id: string
}

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization

  if(!authorizationHeader) return res.status(401).json({ message: "a token is required to access this route" })

  const [, token] = authorizationHeader.split(' ')

  try {
    const { sub } = <JwtPayload>jwt.verify(token, JWT_SECRET)

    req.author = { id: sub! }

    return next()
  } catch (error: any) {
    return res.status(401).json({ message: error.message })
  }
}