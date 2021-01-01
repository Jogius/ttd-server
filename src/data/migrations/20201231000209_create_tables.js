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
      table.uuid('bot_token').notNullable()
    })
  }

  if (!(await knex.schema.hasTable('message'))) {
    await knex.schema.createTable('message', (table) => {
      table.increments('id')
      table.uuid('user_token').notNullable()
      table.foreign('user_token').references('user_token').inTable('user')
      table.string('content', 160).notNullable()
      table.boolean('botChat').defaultTo(false)
    })
  }
}

exports.down = async (knex) => {}
