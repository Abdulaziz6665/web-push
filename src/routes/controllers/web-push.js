const { fetch, fetchAll } = require('../../pg/pg')
module.exports = {
  WEB_PUSH: async (req, res) => {

    const WEB_PUSH = `
      INSERT INTO web_push(
        user_id,
        endpoint_b,
        expiration_time,
        p256dh,
        auth
      ) VALUES ($1, $2, $3, $4, $5)
    `
  
    const SUBSC = `
      SELECT * FROM web_push WHERE user_id = $1
    `
    let { pushManager, userID } = req.body
    let subscriber = await fetch(SUBSC, userID)
    
    if (!subscriber) {
      
      fetch(WEB_PUSH, userID, pushManager.endpoint, null, pushManager.keys.p256dh, pushManager.keys.auth)
      res.send('created')
    }
  }
}