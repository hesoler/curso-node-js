import express from 'express'
import { JWT_SECRET, PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.session.user = data
  } catch {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  // Al usar EJS, se busca en la carpeta "views" por defecto
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '7d' })

    // TODO: guardar el refreshToken en la base de datos o en memoria (opcional)

    // Enviar el token como una cookie segura
    res.cookie('access_token', token, {
      httpOnly: true, // No se puede acceder a la cookie desde JavaScript, solo desde el servidor
      secure: process.env.NODE_ENV === 'production', // Solo se envía en HTTPS
      sameSite: 'strict', // No se envía en solicitudes cross-site, es accesible solo en el mismo dominio
      maxAge: 1000 * 60 * 60 // la cookie tiene validez durante 1 hora
    })
    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const userId = await UserRepository.create({ username, password })
    res.status(201).json({ userId })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  res.status(200).json({ message: 'Logged out successfully' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Access denied')
  res.render('protected', user) // { _id, username }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
