const express = require('express')
const router = express.Router()
const login = require('./controllers/login')
const user = require('./controllers/user')
const chat = require('./controllers/chat')
const push = require('./controllers/web-push')

router.get('/login', login.LOGIN)
router.post('/login', login.LOGIN_POST)
router.post('/signup', login.SIGN_UP)
router.get('/user', user.USER)
router.get('/chats-get', chat.CHATS_GET)
router.post('/sub', push.WEB_PUSH)

module.exports.router = router