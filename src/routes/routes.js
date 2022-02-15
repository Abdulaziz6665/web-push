const express = require('express')
const router = express.Router()
const login = require('./controllers/login')
const user = require('./controllers/user')
const chat = require('./controllers/chat')
// const webPush = require('web-push')

const {fetch, fetchAll} = require('../pg/pg')

// const publicKey = 'BDmzBWX_ZVY86pXthfcqsox_HET1M0ijNFmFeiMCTxnOoPrun9OVXGZMr_p-JqZnkSUrULNboygSOvlyyMDgoAU'
// const privateKey = 'bzegeZthepS5705Qzq50IurA_9x7a6DcEjwzwVlZAnk'

// webPush.setVapidDetails(
//   "mailto:mr.yunusobod@gmail.com",
//   publicKey,
//   privateKey
// )

router.get('/login', login.LOGIN)
router.post('/login', login.LOGIN_POST)
router.post('/signup', login.SIGN_UP)
router.get('/user', user.USER)
router.get('/chats-get', chat.CHATS_GET)

router.post('/sub', (req, res) => {

  const WEB_PUSH = `
    INSERT INTO web_push(
      user_id,
      endpoint_b,
      expiration_time,
      p256dh,
      auth
    ) VALUES ($1, $2, $3, $4, $5)
  `
  let { pushManager, userID } = req.body
  console.log(pushManager)
  fetch(WEB_PUSH, userID, pushManager.endpoint, null, pushManager.keys.p256dh, pushManager.keys.auth)
  
  // webPush.sendNotification(a, "text + ' from ' + user")
})

module.exports.router = router