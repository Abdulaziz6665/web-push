const { fetch, fetchAll } = require('../../pg/pg')
const { sign, verify} = require('../../lib/jwt')

module.exports = {
  CHATS: async (req, res) => {
    // console.log(req.body)
    // console.log(req.headers)
    console.log(req.file)
  },
}