// import { this.movieModel } from '../models/mysql/movies.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    try {
      let movies
      const { genre } = req.query

      if (genre) {
        movies = await this.movieModel.getAll({ genre })
      } else {
        movies = await this.movieModel.getAll({})
      }
      res.json(movies)
    } catch (err) {
      res.status(500).json({ message: 'Could not get movies', err })
    }
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found.' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await this.movieModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (!updateMovie) {
      return res.status(500).json({ error: 'Error updating movie.' })
    }

    return res.json(updateMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Could not be deleted. Movie not found.' })
    }

    return res.json({ message: 'Movie successfully deleted.' })
  }
}
