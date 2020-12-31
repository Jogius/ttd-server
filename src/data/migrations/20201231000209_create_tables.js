exports.up = async (knex) => {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', (table) => {
      table.string('token', 36).notNullable().primary()
      table.string('username', 30).notNullable()
    })
  }
}

exports.down = async (knex) => {}
