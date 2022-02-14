const { verify: verification, sign: signed } = require('jsonwebtoken')
const { SECRET, EXPIRES_IN } = require('../config')

module.exports = {
   sign: (payload) => signed(payload, SECRET, {expiresIn: EXPIRES_IN}),
   verify: accessToken => verification(accessToken, SECRET, {expiresIn: EXPIRES_IN})
}