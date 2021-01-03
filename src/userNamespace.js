const uuid = require('uuid')

const knex = require('./knex')
const state = require('./data/state')
const chatNumber = require('./util/chatNumber')

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

  socket.on('auth/create', async (unprocessedUsername) => {
    const userToken = uuid.v4()
    const username = unprocessedUsername.toLowerCase()
    await knex('user').insert({
      userToken,
      username,
      chatNumber: chatNumber(),
    })

    state.userSockets[userToken] = state.sockets[socket.id]
    delete state.sockets[socket.id]

    socket.emit('auth/login', {
      username,
      userToken,
    })
  })
  socket.on('auth/join', async (userToken) => {
    const { username } = await knex('user')
      .where('userToken', userToken)
      .first('username')

    state.userSockets[userToken] = state.sockets[socket.id]
    delete state.sockets[socket.id]

    socket.emit('auth/login', {
      username,
      userToken,
    })
  })

  socket.on('auth/newSocket', (userToken) => {
    state.userSockets[userToken] = socket
  })
  socket.on('auth/newConnection', () => {
    state.sockets[socket.id] = socket
  })
}
