const knexConfig = require('./knexConfig')

const knex = require('knex')(knexConfig)

const migrate = async () => {
  const [completed, newMigrations] = await knex.migrate.list()
  if (newMigrations.length > 0) {
    console.log('[DB MESSAGE] Updating database')
    await knex.migrate.latest()
    console.log('[DB MESSAGE] Done!')
  }
}
migrate()

module.exports = knex
