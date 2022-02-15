const express = require('express');
const app = express()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')


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







const IO = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

IO.on('connection', socket => {
  socket.on('message', async ({userID, selectedUser, text, pushNotify }) => {
    const CHAT = `
        INSERT INTO chat(
          chat,
          sender_user_id,
          taked_user_id
        ) VALUES ($1, $2, $3)
        returning *
    `
    

    // let subscriber = {
    //   "endpoint": "https://fcm.googleapis.com/fcm/send/fwiwWNsQ6as:APA91bExzR_W0m2oQUO1wUYw3eHanKlPP_f3O8LLl0f3N3RaGkAlvHSP_KKK8_22-bQoN0SF7CYYolY0wuk0tV5GV1zqrMuG8OCPDh8vSzL25I6rAExjwarIH8xRuUxxhjH6eODn_Kdl",
    //   "expirationTime": null,
    //   "keys": {
    //       "p256dh": "BItOL3GO2kUYnOHF2Vi5b5TOWkVS0sYn5PmQ1hG2b6wBONQtjLCrHiHPtwY4k2nGw093u2c-6JVnupQ___5mAeM",
    //       "auth": "MM8u5iFNQswk6q8sTHnkAg"
    //   }
    // }
    let subscriber = pushNotify
    subscriber = JSON.stringify(subscriber)
    
    if (text) {
      const createChat = await fetch(CHAT, text, userID, selectedUser)
      IO.emit('message', createChat)
      
    }
  })
})


server.listen(3001, () => console.log('port: 3001'))