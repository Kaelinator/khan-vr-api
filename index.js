const express = require('express')
const app = express()
require('dotenv').config()
const khan = require('khan')(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET)
const path = require('path')

app.use(express.static('public'))

app.get('/', (req, res) => {

  res.sendFile(path.join('public', 'main.html'), {root: __dirname })
})

app.get('/oauth', (req, res) => {

  khan
    .requestToken('http://localhost:3000/oauth/callback')
    .then(tokens => {

      res.redirect(`https://www.khanacademy.org/api/auth2/authorize?oauth_token=${tokens['oauth_token']}`)
    })
})

app.get('/oauth/callback', (req, res) => {

  khan.accessToken(req.query['oauth_token'], req.query['oauth_verifier'], req.query['oauth_token_secret'])
    .then(({ oauth_token, oauth_token_secret }) => khan(oauth_token_secret, oauth_token).user())
    .then(u => res.json(u))
    .catch(err => res.json(err))
})

app.listen(process.env.PORT || 3000)