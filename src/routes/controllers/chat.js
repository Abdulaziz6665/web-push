const { fetch, fetchAll } = require('../../pg/pg')

module.exports = {
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