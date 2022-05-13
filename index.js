const express = require('express');
const app = express()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
const fileUpload = require('express-fileupload')
const webPush = require('web-push')
const path = require('path')
const fs = require('fs')
const {promisify} = require('util')

const { fetch, fetchAll } = require('./src/pg/pg')
const { router} = require('./src/routes/routes')
const { sign } = require('./src/lib/jwt')







const server = http.createServer(app)

const PORT = process.env.PORT || 3001

app.use(express.static(__dirname + '/uploads'))

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  next()
})

app.use(fileUpload())
app.use(express.json())
app.use(cors())
app.use(router)
app.use(express.static('./src'))

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

const IO = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

IO.sockets.on('connection', socket => {
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

    socket.on('new-file', async ({chat_id}) => {
      const FIND_CHAT_FILE = `
        SELECT * FROM chat WHERE chat_id = $1
      `
      const newFile = await fetch(FIND_CHAT_FILE, chat_id)
      if (newFile) {
        IO.emit('new-filee', newFile)
      }
    })

    socket.on('delete', async ({del}) => {
      const DELETE = `
        DELETE FROM chat where chat_id = $1 returning chat_id, file_link
      `
      const deleted = await fetch(DELETE, del)

      if (deleted.file_link) {
        const unlink = promisify(fs.unlink)
        await unlink(__dirname +'/src'+ deleted.file_link)
      }

      if (deleted) {
        IO.emit('delete', deleted)
      }
    })

    socket.on('edit-text', async ({text, chat_id}) => {
      const UPDATE_CHAT = `
        UPDATE chat
        set chat = $2
        WHERE chat_id = $1
        returning *
      `
      const updated = await fetch(UPDATE_CHAT, chat_id, text)

      if (updated) {
        IO.emit('edit-text', updated)
      }
      
    })
  } catch (error) {
    console.log(error)
  }
})


server.listen(PORT, () => console.log('port: 3001'))