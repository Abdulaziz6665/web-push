const express = require('express');
const app = express()
const cors = require('cors')

const {router} = require('./src/routes/routes')

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(3001, () => console.log('port: 3001'))