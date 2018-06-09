
const Promise = require('bluebird')
const khan = require('khan')(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET)

let codes = {}

const isTokenAlive = ({ oauth_token, oauth_token_secret }) =>
  khan(oauth_token_secret, oauth_token).user()
    .then(() => true)
    .catch(() => console.log('error') || false)


module.exports = {

  add: (code, tokens) => {
    codes[code] = tokens
  },

  get: code => codes[code],

  refresh: () => {
    Promise.resolve(Object.entries(codes))
      .filter(pair => isTokenAlive(pair[1]))
      .reduce((obj, pair) => ({ ...obj, [pair[0]]: pair[1] }), {})
      .then(obj => { code = obj }) // yikes
  },

  isTokenAlive
}
