exports.up = async (knex) => {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('username', 30).notNullable()
      table.string('token', 36).notNullable()
    })
  }
}

exports.down = async (knex) => {}
