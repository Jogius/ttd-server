const fs = require('fs')
const path = require('path')

const config = require('ini').parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'CONFIG.ini'), 'utf-8')
)

config.knexConfig = {
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

module.exports = config
