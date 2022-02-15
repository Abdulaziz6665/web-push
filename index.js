const express = require('express');
const app = express()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const webPush = require('web-push')
const path = require('path')
const { fetch, fetchAll } = require('./src/pg/pg')
const { router } = require('./src/routes/routes')
const { sign } = require('./src/lib/jwt')


const server = http.createServer(app)

const PORT = process.env.PORT || 3001


app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  next()
})

app.use(express.json())
app.use(cors())
app.use(router)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
  })
}


const publicKey = 'BDmzBWX_ZVY86pXthfcqsox_HET1M0ijNFmFeiMCTxnOoPrun9OVXGZMr_p-JqZnkSUrULNboygSOvlyyMDgoAU'
const privateKey = 'bzegeZthepS5705Qzq50IurA_9x7a6DcEjwzwVlZAnk'


webPush.setVapidDetails(
  "mailto:mr.yunusobod@gmail.com",
  publicKey,
  privateKey
)

const IO = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

IO.on('connection', socket => {
  try {
    socket.on('message', async ({ userID, selectedUser, text, senderUser }) => {
      const CHAT = `
          INSERT INTO chat(
            chat,
            sender_user_id,
            taked_user_id
          ) VALUES ($1, $2, $3)
          returning *
      `

      const SUBSC = `
          SELECT * FROM web_push WHERE user_id = $1
      `

      let subscriber = await fetch(SUBSC, selectedUser)
      if (subscriber) {

        let subscription = {
          endpoint: subscriber.endpoint_b,
          expiration_time: null,
          keys: {
            p256dh: subscriber.p256dh,
            auth: subscriber.auth
          }
        }
        webPush.sendNotification(subscription, senderUser + ' send: ' + text)
      }

      if (text) {
        const createChat = await fetch(CHAT, text, userID, selectedUser)
        IO.emit('message', createChat)
      }
    })

    socket.on('new_user', async ({ name, pass }) => {
      const CHECK_USER = `
      SELECT * FROM users where lower(user_name) = lower($1)
      `
      const CREATE_USER = `
      INSERT INTO users(user_name, user_pass) VALUES($1, crypt($2, gen_salt('bf'))) returning *
      `
      const hasUser = await fetch(CHECK_USER, name)
      if (hasUser) return IO.emit('new_user', 'This name is taken')

      const newUser = await fetch(CREATE_USER, name, pass)
      if (newUser) {
        IO.emit('new_user', {
          token: sign({ userID: newUser.user_id }),
          newUser
        })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

server.listen(PORT, () => console.log('port: 3001'))