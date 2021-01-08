const router = require('express').Router()

const uuid = require('uuid')

const knex = require('../knex')
const connectSockets = require('../connectSockets')

router.post('/start', async (req, res) => {
  if (!(await connectSockets())) return res.json()
  await knex('status').update({ started: true, sessionToken: uuid.v4() })
  const userNamespace = req.app.get('userNamespace')

  const users = await knex('user').select('userToken', 'userRoomId')
  var userRoomIds = {}
  users.forEach(({ userToken, userRoomId }) => {
    userRoomIds[userToken] = userRoomId
  })
  userNamespace.sockets.forEach((socket) => {
    socket.join(userRoomIds[socket.userToken])
  })

  userNamespace.emit('status/start')
  res.json()
})

router.post('/stop', async (req, res) => {
  await knex('status').update({ started: false })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/stop')
  res.json()
})

router.post('/chat/start', async (req, res) => {
  await knex('status').update({ chatting: true })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/startChatting')
  res.json()
})

router.post('/chat/stop', async (req, res) => {
  await knex('status').update({ chatting: false })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/stopChatting')
  res.json()
})

router.post('/vote/start', async (req, res) => {
  await knex('status').update({ voting: true })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/startVoting')
  res.json()
})

router.post('/vote/stop', async (req, res) => {
  await knex('status').update({ voting: false })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/stopVoting')
  res.json()
})

router.post('/results/start', async (req, res) => {
  await knex('status').update({ results: true })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/startResults')
  res.json()
})

router.post('/results/stop', async (req, res) => {
  await knex('status').update({ results: false })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('status/stopResults')
  res.json()
})

module.exports = router
