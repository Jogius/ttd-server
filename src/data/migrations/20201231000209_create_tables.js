exports.up = async (knex) => {
  if (!(await knex.schema.hasTable('status'))) {
    await knex.schema.createTable('status', (table) => {
      table.char('lock', 1).primary()
      table.boolean('started').defaultTo(false)
      table.boolean('chatting').defaultTo(false)
      table.boolean('voting').defaultTo(false)
      table.boolean('results').defaultTo(false)
    })
    await knex('status').insert({ lock: 'X' })
  }

  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', (table) => {
      table.uuid('user_token').notNullable().primary()
      table.string('username', 30).notNullable()
    })
  }
}

exports.down = async (knex) => {}
