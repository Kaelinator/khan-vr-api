const OAuth1Client = require('oauth-1-client')

const khanAcademy = new OAuth1Client({
  key: process.env.CONSUMER_KEY,
  secret: process.env.CONSUMER_SECRET,
  callbackURL: 'https://khan-vr-api.herokuapp.com/',
  requestUrl: 'https://www.khanacademy.org/api/auth2/request_token',
  accessUrl: 'https://www.khanacademy.org/api/auth2/access_token',
  apiHostName: 'www.khanacademy.org'
})