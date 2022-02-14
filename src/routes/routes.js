const express = require('express')
const router = express.Router()
const login = require('./controllers/login')
const user = require('./controllers/user')

router.get('/login', login.LOGIN)
router.post('/login', login.LOGIN_POST)
router.post('/signup', login.SIGN_UP)
router.get('/user', user.USER)

module.exports.router = router