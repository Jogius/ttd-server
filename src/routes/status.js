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

router.post('/chat/start', async (req, res) => {
  await knex('status').update({ chatting: true })
  res.json()
})

router.post('/chat/stop', async (req, res) => {
  await knex('status').update({ chatting: false })
  res.json()
})

router.post('/vote/start', async (req, res) => {
  await knex('status').update({ voting: true })
  res.json()
})

router.post('/vote/stop', async (req, res) => {
  await knex('status').update({ voting: false })
  res.json()
})

router.post('/results/start', async (req, res) => {
  await knex('status').update({ results: true })
  res.json()
})

router.post('/results/stop', async (req, res) => {
  await knex('status').update({ results: false })
  res.json()
})

module.exports = router
