const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/done', (req, res) => {
  res.send('it worked!')
})

app.get('/oauth', require('./public/oauth'))

app.listen(process.env.PORT || 3000)