const express = require('express')
const app = express()
const dotenv = require('dotenv')
const OAuth = require('oauth').OAuth
const session = require('express-session')
dotenv.config()
const khan = require('khan')(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))


app.get('/oauth', (req, res) => {

  khan
    .requestToken()
    .then(tokens => {

      const authorize = 'https://www.khanacademy.org/api/auth2/authorize'
      // const callback = encodeURIComponent('http://localhost:3000/oauth/callback')
      console.log(tokens)
      const callback = 'http://localhost:3000/oauth/callback'
      const str = `${authorize}?oauth_token=${tokens['oauth_token']}&oauth_callback=${callback}`
      console.log(str)
      res.redirect(str)
    })
})

app.get('/oauth/callback', (req, res, next) => {

  console.log('oauth_token:', req.query['oauth_token'])
  console.log('oauth_token_secret:', req.query['oauth_token_secret'])

  khan.accessToken(req.query['oauth_token'], undefined, req.query['oauth_token_secret'])
    .then(({ oauth_token, oauth_token_secret }) => khan(oauth_token_secret, oauth_token).user())
    .then(u => res.json({ u }))
    .catch(err => res.json({ err }))
})

app.listen(process.env.PORT || 3000)