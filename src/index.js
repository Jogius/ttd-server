const express = require('express')

const app = express()
app.disable('x-powered-by')

const cors = require('cors')
app.use(cors({ origin: process.env.ORIGIN }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const resetRouter = require('./routes/reset')
app.use('/reset', resetRouter)

const statusRouter = require('./routes/status')
app.use('/status', statusRouter)

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
})

const handleUserNamespaceConnection = require('./userNamespace')
const userNamespace = io.of('/user')
userNamespace.on('connection', async (socket) =>
  handleUserNamespaceConnection(socket)
)

app.set('userNamespace', userNamespace)

server.listen(process.env.PORT)
