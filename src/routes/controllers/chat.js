const { fetch, fetchAll } = require('../../pg/pg')
const { sign, verify} = require('../../lib/jwt')

module.exports = {
  CHATS: async (req, res) => {
    try {
      const CHAT = `
        INSERT INTO chat(
          chat,
          sender_user_id,
          taked_user_id
        ) VALUES ($1, $2, $3)
        returning *
      `
      const {userid, selecteduser, text} = req.headers
      if (!text) return res.send('message required')
      const createChat = await fetch(CHAT, text, userid, selecteduser)
      
    } catch (error) {
      console.log(error)
    }
  },
  CHATS_GET: async (req, res) => {
    try {
      const CHATS = `
        SELECT * from chat WHERE (sender_user_id in($1, $2)) AND (taked_user_id in($1, $2)) order by created_at asc
      `

      const {userID, selectedUser} = req.query
      
      const chats = await fetchAll(CHATS, userID, selectedUser)
      
      res.json(chats)
      
    } catch (error) {
      console.log(error)
    }
  },
}