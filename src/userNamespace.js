const uuid = require('uuid')

const knex = require('./knex')
const state = require('./data/state')
const generateChatNumber = require('./util/generateChatNumber')

module.exports = async (socket) => {
  const status = await knex('status').first([
    'started',
    'chatting',
    'voting',
    'results',
  ])
  socket.emit('status', status)

  socket.onAny((event, ...args) => {
    console.log(`event: ${event}\n  args: ${args}`)
  })

  socket.on('auth/create', async (unprocessedUsername, callback) => {
    const userToken = uuid.v4()
    const username = unprocessedUsername.toLowerCase()
    await knex('user').insert({
      userToken,
      username,
      userChatNumber: generateChatNumber(),
    })
    socket.userToken = userToken

    callback(username, userToken)
  })
  socket.on('auth/join', async (userToken, callback) => {
    const { username } = await knex('user')
      .where('userToken', userToken)
      .first('username')

    callback(username, userToken)
  })

  socket.on('chat1/message', async ({ message, userToken }) => {
    const { userRoomId, userChatNumber } = await knex('user')
      .where('userToken', userToken)
      .first('userRoomId', 'userChatNumber')

    if (userChatNumber === 1) {
      const recipientUserChatNumber = (
        await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('userChatNumber')
      ).userChatNumber
      socket
        .to(userRoomId)
        .emit(`chat${recipientUserChatNumber}/message`, message)
    } else if (userChatNumber === 2) {
      console.log('Bot has to answer, sending placeholder')
      socket.emit('chat1/message', 'I am not a bot!')
    }
  })

  socket.on('chat2/message', async ({ message, userToken }) => {
    const { userRoomId, userChatNumber } = await knex('user')
      .where('userToken', userToken)
      .first('userRoomId', 'userChatNumber')

    if (userChatNumber === 2) {
      const recipientUserChatNumber = (
        await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('userChatNumber')
      ).userChatNumber
      socket
        .to(userRoomId)
        .emit(`chat${recipientUserChatNumber}/message`, message)
    } else if (userChatNumber === 1) {
      console.log('Bot has to answer, sending placeholder')
      socket.emit('chat2/message', 'I am not a bot!')
    }
  })
}
