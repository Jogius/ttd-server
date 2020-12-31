exports.up = async (knex) => {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', (table) => {
      table.uuid('token').notNullable().primary()
      table.string('username', 30).notNullable()
    })
  }
  if (!(await knex.schema.hasTable('status'))) {
    await knex.schema.createTable('status', (table) => {
      table.char('lock', 1).notNullable().defaultTo('X').primary()
      table.boolean('started').notNullable().defaultTo(false)
      table.boolean('chatting').notNullable().defaultTo(false)
      table.boolean('voting').notNullable().defaultTo(false)
      table.boolean('results').notNullable().defaultTo(false)
    })
    await knex('status').insert({ lock: 'X' })
  }
}

exports.down = async (knex) => {}
