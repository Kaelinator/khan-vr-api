
const OAuth = require('oauth').OAuth

module.exports = () => {
  const oauth = new OAuth(
    'https://www.khanacademy.org/api/auth2/request_token',
    'https://www.khanacademy.org/api/auth2/access_token',
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    '1.0',
    'https://khan-vr-api.herokuapp.com/done',
    'HMAC-SHA1',
    64
  )

  oauth.getOAuthRequestToken(requestTokenCallback)
}

const finalCallback = (err, data, res) => {

  if (err) {
    console.log('finalCallback', err)
    return
  }

  console.log('finalCallback data:', data)
  console.log('finalCallback res:', res)
}

const accessTokenCallback = (err, accessToken, accessTokenSecret, res) => {

  if (err) {
    console.log('accessTokenCallback', err)
    return
  }

  console.log('accessToken:', accessToken)
  console.log('accessTokenSecret:', accessTokenSecret)
  console.log('accessTokenCallback res:', res)
  oauth.getProtectedResource(
    'https://www.khanacademy.org/api/v1/user',
    'GET',
    accessToken,
    accessTokenSecret,
    finalCallback
  )
}

const requestTokenCallback = (err, token, tokenSecret, res) => {

  if (err) {
    console.log('requestTokenCallback', err)
    return
  }

  console.log('token:', token)
  console.log('tokenSecret:', tokenSecret)
  console.log('requestTokenCallback res:', res)
  console.log('requesting access token')
  oauth.getOAuthAccessToken(token, tokenSecret, accessTokenCallback)
}
