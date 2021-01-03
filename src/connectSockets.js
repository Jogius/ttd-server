const uuid = require('uuid')

const knex = require('./knex')
const shuffle = require('./util/shuffle')

module.exports = async () => {
  const query = await knex('user').select('userToken')

  var userTokens = []
  for (var i = 0; i < query.length; i++) {
    userTokens.push(query[i].userToken)
  }

  userTokens = shuffle(userTokens)
  if (userTokens.length <= 1) return false
  for (var i = 0; i < userTokens.length; i++) {
    if (i % 2 === 0) {
      const userRoomId = uuid.v4()
      await knex('user')
        .where('userToken', userTokens[i])
        .orWhere('userToken', userTokens[i + 1])
        .update('userRoomId', userRoomId)
    }
  }
  return true
}
