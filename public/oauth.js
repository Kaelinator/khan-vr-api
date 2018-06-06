
const util = require('util')

module.exports = (req, res) => {

  

  

  
  
  function accessTokenCallback(err, accessToken, accessTokenSecret, res) {

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

  function finalCallback(err, data, res) {

    if (err) {
      console.log('finalCallback', err)
      return
    }

    console.log('finalCallback data:', data)
    console.log('finalCallback res:', res)
  }
}

