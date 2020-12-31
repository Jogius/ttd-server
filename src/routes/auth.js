const router = require('express').Router()
const uuid = require('uuid')

const knex = require('../knex')

router.post('/create', async (req, res) => {
  const token = uuid.v4()
  const username = req.body.username.toLowerCase()
  await knex('users').insert({
    username,
    token,
  })
  res.json({ token, username })
})

router.post('/join', async (req, res) => {
  const token = req.body.token
  const username = await knex('users').where({ token }).first('username')
  res.json({ token, username })
})

module.exports = router
