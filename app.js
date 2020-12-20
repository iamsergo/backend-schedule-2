const express = require('express')
const app = express()
const bp = require('body-parser')
const favicon = require('express-favicon')

const group = require('./routes/group')
const user = require('./routes/user')
const schedule = require('./routes/schedule')
const streams = require('./routes/streams')

app.use(require('cors')())

app.use(favicon(__dirname + 'favicon.ico'))

app.use(bp.json())

app.use('/', group)
app.use('/', user)
app.use('/', schedule)
app.use('/', streams)

const PORT = process.env.PORT || 5000
app.listen(PORT)