const router = require('express').Router()

const knex = require('../knex')
const state = require('../data/state')

router.post('/all', async (req, res) => {
  await knex('status').update({
    started: false,
    chatting: false,
    voting: false,
    results: false,
  })
  await knex('user').delete()
  await knex('userRoomMessage').delete()
  await knex('botRoomMessage').delete()
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('reset/all')

  res.json()
})

router.post('/status', async (req, res) => {
  await knex('status').update({
    started: false,
    chatting: false,
    voting: false,
    results: false,
  })
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('reset/status')
  res.json()
})

router.post('/messages', async (req, res) => {
  await knex('userRoomMessage').delete()
  await knex('botRoomMessage').delete()
  const userNamespace = req.app.get('userNamespace')
  userNamespace.emit('reset/messages')
  res.json()
})

module.exports = router
