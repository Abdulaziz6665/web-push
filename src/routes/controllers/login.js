const { fetch } = require('../../pg/pg')
const { sign, verify} = require('../../lib/jwt')

module.exports = {
  LOGIN: (req, res) => {
    res.send('okay')
  },
  SIGN_UP: async (req, res) => {
    try {
      const CHECK_USER = `
      SELECT * FROM users where lower(user_name) = lower($1)
      `
      const CREATE_USER = `
      INSERT INTO users(user_name, user_pass) VALUES($1, crypt($2, gen_salt('bf'))) returning *
      `

      const { name, pass } = req.body

      const hasUser = await fetch(CHECK_USER, name)
      if (hasUser) return res.send('This name is taken')
      
      const newUser = await fetch(CREATE_USER, name, pass)
      if (newUser){
        res.json({
          token: sign({userID: newUser.user_id})
        })
      }

    } catch (error) {
      console.log(error)
    }
  },
  LOGIN_POST: async (req, res) => {
    try {
      const CHECK_USER = `
      SELECT * FROM users where lower(user_name) = lower($1) AND user_pass = crypt($2, user_pass)
      `

      const { name, pass } = req.body

      const hasUser = await fetch(CHECK_USER, name, pass)
      if (!hasUser) return res.send('User not found')
      
        res.json({
          token: sign({userID: hasUser.user_id})
        })

    } catch (error) {
      console.log(error)
    }
  },
}