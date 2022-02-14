const { verify: verification, sign: signed } = require('jsonwebtoken')
const { SECRET, EXPIRES_IN } = require('../config')

export const sign = (payload) => signed(payload, SECRET, {expiresIn: EXPIRES_IN})
export const verify = accessToken => {
   return verification(accessToken, SECRET, {expiresIn: EXPIRES_IN})
}