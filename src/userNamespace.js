const uuid = require('uuid')

const knex = require('./knex')
const { newBot, getAnswer } = require('./chatbotHandler')
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
    newBot(userToken)

    callback(username, userToken)
  })
  socket.on('auth/join', async (userToken, callback) => {
    const { username } = await knex('user')
      .where('userToken', userToken)
      .first('username')
    socket.userToken = userToken

    callback(username, userToken)
  })

  socket.on('auth/newSocket', async (userToken) => {
    const { userRoomId } = await knex('user')
      .where('userToken', userToken)
      .first('userRoomId')
    socket.userToken = userToken
    socket.join(userRoomId)
  })

  socket.on('chat1/message', async ({ message, userToken }) => {
    if (
      !socket.userRoomId ||
      !socket.userChatNumber ||
      !socket.recipientUserChatNumber
    ) {
      const { userRoomId, userChatNumber } = await knex('user')
        .where('userToken', userToken)
        .first('userRoomId', 'userChatNumber')
      const recipientUserChatNumber = (
        await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('userChatNumber')
      ).userChatNumber
      socket.userRoomId = userRoomId
      socket.userChatNumber = userChatNumber
      socket.recipientUserChatNumber = recipientUserChatNumber
    }

    if (socket.userChatNumber === 1) {
      await knex('userRoomMessage').insert({
        authorToken: socket.userToken,
        roomId: socket.userRoomId,
        content: message,
      })
      socket
        .to(socket.userRoomId)
        .emit(`chat${socket.recipientUserChatNumber}/message`, message)
    } else if (socket.userChatNumber === 2) {
      await knex('botRoomMessage').insert({
        userToken: socket.userToken,
        content: message,
      })
      getAnswer(socket.userToken, message, (answer) => {
        socket.emit('chat1/message', answer)
      })
    }
  })

  socket.on('chat2/message', async ({ message, userToken }) => {
    if (
      !socket.userRoomId ||
      !socket.userChatNumber ||
      !socket.recipientUserChatNumber
    ) {
      const { userRoomId, userChatNumber } = await knex('user')
        .where('userToken', userToken)
        .first('userRoomId', 'userChatNumber')
      const recipientUserChatNumber = (
        await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('userChatNumber')
      ).userChatNumber
      socket.userRoomId = userRoomId
      socket.userChatNumber = userChatNumber
      socket.recipientUserChatNumber = recipientUserChatNumber
    }

    if (socket.userChatNumber === 2) {
      await knex('userRoomMessage').insert({
        authorToken: socket.userToken,
        roomId: socket.userRoomId,
        content: message,
      })
      socket
        .to(socket.userRoomId)
        .emit(`chat${socket.recipientUserChatNumber}/message`, message)
    } else if (socket.userChatNumber === 1) {
      await knex('botRoomMessage').insert({
        userToken: socket.userToken,
        content: message,
      })
      getAnswer(socket.userToken, message, (answer) => {
        socket.emit('chat2/message', answer)
      })
    }
  })
}
