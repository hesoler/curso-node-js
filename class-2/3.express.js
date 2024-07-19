const ditto = require('./pokemon/ditto.json')
const express = require('express')
const app = express()
app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

//* cómo funciona internamente el middleware de express
// app.use((req, res, next) => {
//   console.log('mi primer middleware')
//   if (req.method !== 'POST' ||
//   req.headers['content-type'] !== 'application/json') return next()

//   let body = ''

//   // escuchar el evento data
//   req.on('data', (chunk) => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     data.timestamp = Date.now()
//     // mutar la request y guardar la información en el body
//     req.body = data
//     next()
//   })
// })

//* cómo usar el middleware de express
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Mi página</h1>')
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  // aquí deberíamos guardar en BD
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
