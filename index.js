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
  socket.on('message', async ({userID, selectedUser, text }) => {
    const CHAT = `
        INSERT INTO chat(
          chat,
          sender_user_id,
          taked_user_id
        ) VALUES ($1, $2, $3)
        returning *
    `
    if (text) {
      const createChat = await fetch(CHAT, text, userID, selectedUser)
      IO.emit('message', createChat)
    }
  })
})


server.listen(3001, () => console.log('port: 3001'))