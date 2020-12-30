const config = require('./config')

// Import express app
const app = require('./app')

// Create http server for socket.io
const server = require('http').createServer(app)

// Instantiate socket.io server
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.send('Hello!')

  socket.on('message', (msg) => {
    console.log(msg)
  })

  socket.onAny((event, ...args) => {
    console.log(`event: ${event}\nargs: ${args}`)
  })
})

const knex = require('./knex')
const migrate = async () => {
  const [completed, newMigrations] = await knex.migrate.list()
  if (newMigrations.length > 0) {
    console.log('[DB MESSAGE] Updating database')
    await knex.migrate.latest()
    console.log('[DB MESSAGE] Done!')
  }
}
migrate()

// Start http server
server.listen(config.PORT)
