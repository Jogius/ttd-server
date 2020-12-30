const knexConfig = require('./config').knexConfig
module.exports = require('knex')(knexConfig)
