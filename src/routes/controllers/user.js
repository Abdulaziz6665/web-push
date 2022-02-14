const { fetch, fetchAll } = require('../../pg/pg')
const { sign, verify} = require('../../lib/jwt')

module.exports = {
  USER: async (req, res) => {

    const USER = `
      SELECT
        user_id,
        user_name
      FROM users
      WHERE user_id = $1
    `
    const ANOTHER_USERS = `
      SELECT
          user_id,
          user_name
        FROM users
        WHERE user_id != $1
    `

    const { userID } = verify(req.query.token)
    const user = await fetch(USER, userID)
    const anothers = await fetchAll(ANOTHER_USERS, userID)
    res.json({
      user,
      anothers: anothers || []
    })
  },
}