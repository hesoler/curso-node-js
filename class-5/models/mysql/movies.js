import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'movies_db',
  port: 3306
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    let result

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const resultGenre = connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) like ?;', [lowerCaseGenre]
      )
      const [[{ id }]] = await resultGenre

      result = connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie LEFT JOIN movie_genres ON id = movie_id WHERE genre_id = ?;', [id]
      )
    } else {
      result = connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie'
      )
    }

    const [movies] = await result
    return movies
  }

  static async getById ({ id }) {
    if (!id) return

    const result = connection.query(
      'select title, year, director, duration, poster, rate, bin_to_uuid(id) id from movie where id = uuid_to_bin(?); ', [id]
    )

    const [[movie]] = await result
    return movie
  }

  static async create ({ input }) {
    const {
      genre: arrayGenreInput, // genre es un arreglo
      title,
      year,
      director,
      duration,
      rate,
      poster
    } = input

    const uuidResult = connection.query('SELECT UUID() uuid;')
    const [[{ uuid }]] = await uuidResult

    try {
      connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
      VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )

      if (arrayGenreInput) {
        const queryGenreNameList = arrayGenreInput
          .map(genreName => { return `"${genreName.toLowerCase()}"` })
          .join(', ')

        const [[{ ids }]] = await connection.query(
          `SELECT GROUP_CONCAT(id) as ids FROM genre WHERE LOWER(name) in (${queryGenreNameList});`
        )

        let queryUpdateMovieGenre = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES '

        const movieGenreValues = ids
          .split(',')
          .map(genreId => { return `(UUID_TO_BIN("${uuid}"), ${genreId})` })
          .join(', ')

        queryUpdateMovieGenre += movieGenreValues + ';'
        connection.query(queryUpdateMovieGenre)
      }
    } catch (err) {
      throw new Error('Error creating movie')
      // TODO enviar la traza a un servicio interno
      // sendLog(err)
    }

    const [[movie]] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?); ', [uuid]
    )

    return movie
  }

  static async delete ({ id }) {
    try {
      const result = await connection.query(
        `DELETE FROM movie WHERE id = UUID_TO_BIN("${id}");`
      )
      const [{ affectedRows }] = result

      // eliminar las referencias en movie_genres
      connection.query(`DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN("${id}");`)

      return affectedRows === 1
    } catch (error) {
      throw new Error('Error deleting movie')
    }
  }

  static async update ({ id, input }) {
    let query = 'UPDATE movie SET '
    const updates = []

    for (const key in input) {
      if (key !== 'genre') {
        updates.push(`${key} = ?`)
      }
    }

    query += updates.join(', ')
    query += ` WHERE id = UUID_TO_BIN("${id}")`

    const values = Object.values(input)
    values.push(id)

    try {
      // actualizar primero la tabla movies
      const result = await connection.query(query, values)

      const { genre: arrayGenreInput } = input
      if (arrayGenreInput) {
        const queryGenreNameList = arrayGenreInput
          .map(genreName => { return `"${genreName.toLowerCase()}"` })
          .join(', ')

        const [[{ ids }]] = await connection.query(
          `SELECT GROUP_CONCAT(id) as ids FROM genre WHERE LOWER(name) in (${queryGenreNameList});`
        )

        // eliminar las anteriores referencias en movie_genres e insertar las nuevas
        connection.query(`DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN("${id}");`)

        let queryUpdateMovieGenre = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES '

        const movieGenreValues = ids
          .split(',')
          .map(genreId => { return `(UUID_TO_BIN("${id}"), ${genreId})` })
          .join(', ')

        queryUpdateMovieGenre += movieGenreValues + ';'
        connection.query(queryUpdateMovieGenre)
      }
      const [{ affectedRows }] = result

      if (affectedRows === 1) {
        return this.getById({ id })
      } else {
        return false
      }
    } catch (error) {
      throw new Error('Error updating movie')
    }
  }
}
