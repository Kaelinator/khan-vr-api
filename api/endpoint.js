
const code = require('./code')
const Promise = require('bluebird')

const get = (fetcher, funcName) => {

  switch (funcName) {
    case 'user':
      return fetcher.user()

    case 'userExercises':
      return fetcher.userExercises()

    default:
      return Promise.reject(new Error(`funcName '${funcName}' is not valid`))
  }

}

module.exports = khan => (req, res) => {

  const tokens = code.get(req.query['code'])

  if (!tokens)
    res.json({ success: false })


  const fetcher = khan(tokens['oauth_token_secret'], tokens['oauth_token'])

  get(fetcher, req.params['func'])
    .then(data => res.json({ success: true, data }))
    .catch(err => {

      console.log(err)
      res.json({ success: false })
    })
}