import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { createMovieRouter } from './routes/movies.js'

export const createaApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())
  app.use(corsMiddleware())

  app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' })
  })

  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
