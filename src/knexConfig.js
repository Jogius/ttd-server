const path = require('path')

const knexConfig = {
  client: 'sqlite',
  connection: {
    filename: path.resolve(__dirname, '..', 'db', 'data.sqlite'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'data', 'migrations'),
  },
  log: {
    warn(message) {
      console.warn(`[DB WARNING] ${message}`)
    },
  },
}

module.exports = knexConfig
