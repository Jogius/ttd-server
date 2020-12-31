const router = require('express').Router()
const { Router } = require('express')
const uuid = require('uuid')

const knex = require('../knex')

router.post('/', async (req, res) => {
  const token = uuid.v4()
  const username = req.body.username.toLowerCase()
  await knex('users').insert({
    username,
    token,
  })
  res.json({ message: 'Login erfolgreich', token, username })
})

module.exports = router
