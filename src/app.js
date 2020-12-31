const config = require('./config')

const express = require('express')

const app = express()
app.disable('x-powered-by')

// express middleware
const cors = require('cors')
app.use(cors({ origin: config.ORIGIN }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// express routes
const createRouter = require('./routes/create')
app.use('/create', createRouter)

module.exports = app
