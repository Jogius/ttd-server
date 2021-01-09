const uuid = require('uuid')

const knex = require('./knex')
const axios = require('axios')
const generateChatNumber = require('./util/generateChatNumber')

const log = (message) => {
  console.log(`--------------------\n${message}\n--------------------\n`)
}

module.exports = async (socket) => {
  const status = await knex('status').first([
    'started',
    'chatting',
    'voting',
    'results',
  ])
  socket.emit('status', status)

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

    // Log
    log(`New user: '${username}' (${userToken})`)
  })
  socket.on('auth/join', async (userToken, callback) => {
    const { username } = await knex('user')
      .where('userToken', userToken)
      .first('username')
    socket.userToken = userToken

    callback(username, userToken)

    // Log
    log(`User rejoined: '${username}'`)
  })

  socket.on('auth/newSocket', async (userToken) => {
    const { username, userRoomId } = await knex('user')
      .where('userToken', userToken)
      .first('username', 'userRoomId')
    socket.userToken = userToken
    socket.join(userRoomId)

    // Log
    log(`New socket: '${username}'`)
  })

  socket.on('auth/newConnection', () => {
    // Log
    log(`New connection`)
  })

  socket.on('chat1/message', async ({ message, userToken }) => {
    if (socket.doubleBot === undefined) {
      const { doubleBot } = await knex('user')
        .where('userToken', userToken)
        .first('doubleBot')
      socket.doubleBot = doubleBot
    }

    if (socket.doubleBot) {
      if (socket.userChatNumber === undefined) {
        const { userChatNumber } = await knex('user')
          .where('userToken', userToken)
          .first('userChatNumber')
        socket.userChatNumber = userChatNumber
      }

      if (socket.userChatNumber === 1) {
        await knex('botRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('botRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat1/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (socket.userChatNumber === 2) {
        await knex('doubleBotRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('doubleBotRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat1/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      if (
        socket.userRoomId === undefined ||
        socket.userChatNumber === undefined ||
        socket.recipientUserChatNumber === undefined
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

        // Log
        log(`User message: ${message}`)
      } else if (socket.userChatNumber === 2) {
        await knex('botRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('botRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat1/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  })

  socket.on('chat2/message', async ({ message, userToken }) => {
    if (socket.doubleBot === undefined) {
      const { doubleBot } = await knex('user')
        .where('userToken', userToken)
        .first('doubleBot')
      socket.doubleBot = doubleBot
    }

    if (socket.doubleBot) {
      if (socket.userChatNumber === undefined) {
        const { userChatNumber } = await knex('user')
          .where('userToken', userToken)
          .first('userChatNumber')
        socket.userChatNumber = userChatNumber
      }

      if (socket.userChatNumber === 2) {
        await knex('botRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('botRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat2/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (socket.userChatNumber === 1) {
        await knex('doubleBotRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('doubleBotRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat2/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      if (
        socket.userRoomId === undefined ||
        socket.userChatNumber === undefined ||
        socket.recipientUserChatNumber === undefined
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

        // Log
        log(`User message: ${message}`)
      } else if (socket.userChatNumber === 1) {
        await knex('botRoomMessage').insert({
          userToken: socket.userToken,
          content: message,
        })
        axios
          .post(process.env.BOT_URL, { message: message })
          .then(async (res) => {
            await knex('botRoomMessage').insert({
              userToken: socket.userToken,
              content: res.data.response,
              bot: true,
            })
            setTimeout(() => {
              socket.emit('chat2/message', res.data.response)
            }, Math.random() * 2500 + res.data.response.length * 200)

            // Log
            log(`User message: ${message}\nBot response: ${res.data.response}`)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  })

  socket.on('vote/1', async (userToken, callback) => {
    if (socket.doubleBot === undefined) {
      const { doubleBot } = await knex('user')
        .where('userToken', userToken)
        .first('doubleBot')
      socket.doubleBot = doubleBot
    }

    if (socket.doubleBot) {
      callback(true, true)
    } else {
      if (
        socket.userRoomId === undefined ||
        socket.userChatNumber === undefined ||
        socket.recipientUsername === undefined
      ) {
        const { userRoomId, userChatNumber } = await knex('user')
          .where('userToken', userToken)
          .first('userRoomId', 'userChatNumber')
        const { username } = await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('username')
        socket.userRoomId = userRoomId
        socket.userChatNumber = userChatNumber
        socket.recipientUsername = username
      }

      log(
        `Korrekt?: ${
          socket.userChatNumber === 2
        }\nDouble Bot?: ${false}\nUsername: ${socket.recipientUsername}`
      )
      callback(socket.userChatNumber === 2, false, socket.recipientUsername)
    }
  })

  socket.on('vote/2', async (userToken, callback) => {
    if (socket.doubleBot === undefined) {
      const { doubleBot } = await knex('user')
        .where('userToken', userToken)
        .first('doubleBot')
      socket.doubleBot = doubleBot
    }

    if (socket.doubleBot) {
      callback(true, true)
    } else {
      if (
        socket.userRoomId === undefined ||
        socket.userChatNumber === undefined ||
        socket.recipientUsername === undefined
      ) {
        const { userRoomId, userChatNumber } = await knex('user')
          .where('userToken', userToken)
          .first('userRoomId', 'userChatNumber')
        const { username } = await knex('user')
          .where('userRoomId', userRoomId)
          .andWhereNot('userToken', userToken)
          .first('username')
        socket.userRoomId = userRoomId
        socket.userChatNumber = userChatNumber
        socket.recipientUsername = username
      }

      log(
        `Korrekt?: ${
          socket.userChatNumber === 2
        }\nDouble Bot?: ${false}\nUsername: ${socket.recipientUsername}`
      )
      callback(socket.userChatNumber === 1, false, socket.recipientUsername)
    }
  })
}
