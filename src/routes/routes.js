const express = require('express')
const router = express.Router()
const controllers = require('./controllers/login')

router.get('/login', controllers.LOGIN)
router.post('/login', controllers.LOGIN_POST)
router.post('/signup', controllers.SIGN_UP)

module.exports.router = router