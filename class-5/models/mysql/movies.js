import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'movies_db',
  port: 3306
}

const connection = mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    let result

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const resultGenre = (await connection).query(
        'SELECT id, name FROM genre WHERE LOWER(name) like ?;', [lowerCaseGenre]
      )
      const [[{ id }]] = await resultGenre

      result = (await connection).query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie LEFT JOIN movie_genres ON id = movie_id WHERE genre_id = ?;', [id]
      )
    } else {
      result = (await connection).query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie'
      )
    }

    const [movies] = await result
    return movies
  }

  static async getById ({ id }) {
    if (!id) return

    const result = (await connection).query(
      'select title, year, director, duration, poster, rate, bin_to_uuid(id) id from movie where id = uuid_to_bin(?); ', [id]
    )

    const [[movie]] = await result
    return movie
  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
