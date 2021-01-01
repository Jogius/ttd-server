const express = require('express')

const app = express()
app.disable('x-powered-by')

// express middleware
const cors = require('cors')
app.use(cors({ origin: process.env.ORIGIN }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// express routes
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const statusRouter = require('./routes/status')
app.use('/status', statusRouter)

module.exports = app
