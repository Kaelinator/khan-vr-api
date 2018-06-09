const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const path = require('path')
require('dotenv').config()
const khan = require('khan')(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET)
const code = require('./api/code')

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'code.html'))
})

app.get('/oauth', (req, res) => {

  khan
    .requestToken(`${process.env.OAUTH_CALLBACK}?code=${req.query.code}`)
    .then(tokens => {
      res.redirect(`https://www.khanacademy.org/api/auth2/authorize?oauth_token=${tokens['oauth_token']}`)
    })
})

app.get('/oauth/callback', (req, res) => {

  khan.accessToken(req.query['oauth_token'], req.query['oauth_verifier'], req.query['oauth_token_secret'])
    .then(tokens => code.add(req.query['code'], tokens) || tokens) // yikes
    .then(code.isTokenAlive)
    .then(alive =>
      res.sendFile(path.join(__dirname, 'public', alive && 'success.html' || 'fail.html'))
    )
    .catch(() => res.sendFile(path.join(__dirname, 'public', 'fail.html')))
})

app.get('/api', (req, res) => {

  const tokens = code.get(req.query['code'])

  if (!tokens)
    res.json({ err: true })

  khan(tokens['oauth_token_secret'], tokens['oauth_token'])
    .user()
    .then(() => res.json({ err: false }))
    .catch(err => {

      console.log(err)
      res.json({ err: true })
    })
})

app.get('/api/:func', require('./api/endpoint')(khan))

setInterval(code.refresh, 5000)

app.listen(process.env.PORT || 3000)