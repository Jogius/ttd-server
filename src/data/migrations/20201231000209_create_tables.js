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
      table.uuid('userToken').notNullable().primary()
      table.string('username', 30).notNullable()
      table.integer('userChatNumber', 1)
      table.uuid('userRoomId')
      table.boolean('doubleBot').defaultTo(false)
    })
  }

  if (!(await knex.schema.hasTable('userRoomMessage'))) {
    await knex.schema.createTable('userRoomMessage', (table) => {
      table.increments('id')
      table.uuid('authorToken').notNullable()
      table.foreign('authorToken').references('userToken').inTable('user')
      table.uuid('roomId')
      table.foreign('roomId').references('userRoomId').inTable('user')
      table.string('content', 160).notNullable()
    })
  }

  if (!(await knex.schema.hasTable('botRoomMessage'))) {
    await knex.schema.createTable('botRoomMessage', (table) => {
      table.increments('id')
      table.boolean('bot').defaultTo(false)
      table.uuid('userToken').notNullable()
      table.foreign('userToken').references('userToken').inTable('user')
      table.string('content', 160).notNullable()
    })
  }

  if (!(await knex.schema.hasTable('doubleBotRoomMessage'))) {
    await knex.schema.createTable('doubleBotRoomMessage', (table) => {
      table.increments('id')
      table.boolean('bot').defaultTo(false)
      table.uuid('userToken').notNullable()
      table.foreign('userToken').references('userToken').inTable('user')
      table.string('content', 160).notNullable()
    })
  }
}

exports.down = async (knex) => {}
