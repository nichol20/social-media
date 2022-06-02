import express, { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import db from './db'
import { postRoutes } from './routes/post'
import { userRoutes } from './routes/user'

export const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(userRoutes)
app.use(postRoutes)

app.use('/images', express.static('src/images'))

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack)
  res.status(500).send('Something broke!')
})

// perform a database connection when the server starts
db.connectToServer(err => {
  if(err) {
    console.log(err)
    process.exit()
  }

  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}🥵🥶🤡`))
})

export { app }