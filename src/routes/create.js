const router = require('express').Router()
const { Router } = require('express')
const uuid = require('uuid')

const config = require('../config')
const knex = require('../knex')

router.post('/', async (req, res) => {
  const newToken = uuid.v4()
  await knex('users').insert({ username: req.body.username, token: newToken })
  res
    .cookie('x-token', newToken, { httpOnly: true })
    .json({ message: 'Login erfolgreich', token: newToken })
})

module.exports = router
