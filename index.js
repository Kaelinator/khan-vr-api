const express = require('express')
const app = express()
const dotenv = require('dotenv')
const OAuth = require('oauth').OAuth
const session = require('express-session')

dotenv.config()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

const oa = new OAuth(
  'https://www.khanacademy.org/api/auth2/request_token',
  'https://www.khanacademy.org/api/auth2/access_token',
  process.env.CONSUMER_KEY,
  process.env.CONSUMER_SECRET,
  '1.0',
  'http://localhost:3000/oauth/callback',
  'HMAC-SHA1',
  64
)

app.get('/oauth', (req, res) => {
  oa.getOAuthRequestToken(function requestTokenCallback(err, token, token_secret, results) {

    if (err) {
      console.log('requestTokenCallback', err)
      return
    }

    req.session.oauth = req.session.oauth || {}
    req.session.oauth.token = token
    req.session.oauth.token_secret = token_secret
    res.redirect(`https://www.khanacademy.org/api/auth2/authorize?oauth_token=${token}`)
  })
})

app.get('/oauth/callback', (req, res, next) => {
  if (req.session.oauth) {
    // req.session.oauth.verifier = req.query.oauth_verifier
    // const oauth = req.session.oauth

    oa.getOAuthAccessToken(req.session.oauth.token,
      req.session.oauth.token_secret,
      req.query.oauth_verifier,
      function (error, oauth_access_token, oauth_access_token_secret, results) {

        if (err) {
          console.log('getOAuthAccessToken', err)
          return
        }
        console.log(results)
        res.send(results)
      })
  } else {
    res.send('How\'d you get here?')
  }
})

app.listen(process.env.PORT || 3000)