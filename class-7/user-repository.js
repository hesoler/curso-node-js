import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db', readOnFind: true })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: String,
  password: String
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1. validar los datos
    ValidationUser.validateUsername(username)
    ValidationUser.validatePassword(password)

    // 2. verificar que el usuario no exista
    const existingUser = User.findOne({ username })
    if (existingUser) throw new Error('Username already exists!')

    // 3. crear el usuario
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    ValidationUser.validateUsername(username)
    ValidationUser.validatePassword(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Invalid username or password')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new Error('Invalid username or password')

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

class ValidationUser {
  // 1. validaciones de usuario (opcional: utilizar zod)
  static validateUsername (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
  }

  static validatePassword (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')
  }
}
