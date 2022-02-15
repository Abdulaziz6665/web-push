const express = require('express')
const router = express.Router()
const login = require('./controllers/login')
const user = require('./controllers/user')
const chat = require('./controllers/chat')
const webPush = require('web-push')

const publicKey = 'BDmzBWX_ZVY86pXthfcqsox_HET1M0ijNFmFeiMCTxnOoPrun9OVXGZMr_p-JqZnkSUrULNboygSOvlyyMDgoAU'
const privateKey = 'bzegeZthepS5705Qzq50IurA_9x7a6DcEjwzwVlZAnk'

webPush.setVapidDetails(
    "mailto:mr.yunusobod@gmail.com",
    publicKey,
    privateKey
  )

router.get('/login', login.LOGIN)
router.post('/login', login.LOGIN_POST)
router.post('/signup', login.SIGN_UP)
router.get('/user', user.USER)
router.get('/chats-get', chat.CHATS_GET)

router.post('/sub', (req, res) => {
  
  let a = {"endpoint":"https://fcm.googleapis.com/fcm/send/fwiwWNsQ6as:APA91bExzR_W0m2oQUO1wUYw3eHanKlPP_f3O8LLl0f3N3RaGkAlvHSP_KKK8_22-bQoN0SF7CYYolY0wuk0tV5GV1zqrMuG8OCPDh8vSzL25I6rAExjwarIH8xRuUxxhjH6eODn_Kdl","expirationTime":null,"keys":{"p256dh":"BItOL3GO2kUYnOHF2Vi5b5TOWkVS0sYn5PmQ1hG2b6wBONQtjLCrHiHPtwY4k2nGw093u2c-6JVnupQ___5mAeM","auth":"MM8u5iFNQswk6q8sTHnkAg"}}
  let {pushManager, text, user} = req.body
  webPush.sendNotification(a, text + ' from ' + user)
})

module.exports.router = router