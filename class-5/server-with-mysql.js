import { createaApp } from './app.js'
import { MovieModel } from './models/mysql/movies.js'

createaApp({ movieModel: MovieModel })
