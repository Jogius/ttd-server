const router = require('express').Router()

const knex = require('../knex')

router.get('/', async (req, res) => {
  const status = await knex('status').first([
    'started',
    'chatting',
    'voting',
    'results',
  ])
  res.json(status)
})

router.post('/start', async (req, res) => {
  await knex('status').update({ started: true })
  res.json()
})

router.post('/stop', async (req, res) => {
  await knex('status').update({ started: false })
  res.json()
})

module.exports = router
