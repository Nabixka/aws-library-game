// Update with your config settings.
import 'dotenv/config'
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {


  development: {
    client: 'pg',
    connection: {
      database: 'honkai_star_rail',
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      host:   process.env.DB_HOST
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'honkai_star_rail',
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      host:   process.env.DB_HOST,
      ssl: {
        rejectUnauthorized: false
      }
    },
  }

};
