const express = require('express');
const app = express()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const webPush = require('web-push')

const { fetch, fetchAll } = require('./src/pg/pg')

const server = http.createServer(app)

const {router} = require('./src/routes/routes')

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  next()
})

app.use(express.json())
app.use(cors())
app.use(router)


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
    socket.on('message', async ({userID, selectedUser, text, senderUser }) => {
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
  } catch (error) {
    console.log(error)
  }
})


server.listen(3001, () => console.log('port: 3001'))