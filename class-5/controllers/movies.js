import { MovieModel } from '../models/mysql/movies.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    try {
      let movies
      const { genre } = req.query

      if (genre) {
        movies = await MovieModel.getAll({ genre })
      } else {
        movies = await MovieModel.getAll({})
      }
      res.json(movies)
    } catch (err) {
      res.status(500).json({ message: 'Could not get movies', err })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found.' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })

    if (!updateMovie) {
      return res.status(500).json({ error: 'Error updating movie.' })
    }

    return res.json(updateMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Could not be deleted. Movie not found.' })
    }

    return res.json({ message: 'Movie successfully deleted.' })
  }
}
