const { fetch, fetchAll } = require('../../pg/pg')
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')

const writeFile = promisify(fs.writeFile);

const appPath = function (pathName) {
	return path.join(path.dirname(__dirname), '../', pathName)
}

module.exports = {
  CHATS_GET: async (req, res) => {
    try {
      const CHATS = `
        SELECT
          ch.*
        from chat as ch
        WHERE sender_user_id in($1, $2) AND taked_user_id in($1, $2)
        order by created_at asc
        `
        
      const {userID, selectedUser} = req.query

      const chats = await fetchAll(CHATS, userID, selectedUser)
      
      res.json(chats)
      
    } catch (error) {
      console.log(error)
    }
  },
  CHATS_FILE: async (req, res) => {
    try {
      
      const {name, data} = req.files.file
      const {userid, selecteduser} = req.headers
  
      const FILE = `
        INSERT INTO chat(
          file_link,
          sender_user_id,
          taked_user_id
        ) VALUES ($1, $2, $3) returning *
      `
      const fileName = new Date().getTime() +'.'+ name.split('.').pop()
      const pathName = `/uploads/${fileName}`
      const file = appPath(pathName)
  
      writeFile(file, data, async(err) => {
      });
      const resFile = await fetch(FILE, pathName, userid, selecteduser)
      res.json({chat_id: resFile.chat_id, file_link: resFile.file_link})
    } catch (error) {
      console.log(error)
    }
  }
}