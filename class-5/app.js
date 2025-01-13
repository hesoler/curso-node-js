import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// como leer json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// en el futuro se usará esta forma
// import movies from'./movies.json with { type: 'json' }

//* forma recomendada
// const movies = readJSON('./movies.json')

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
