const express = require('express')
const app = express()
const passport = require('./passport.js')

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({
  secret: 'test',
  resave: false,
  saveUninitialized: false,
  proxy: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', function (req, res) {
  res.send('Hello World')
})

// Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
const basicToLocal = () => {
  return (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader || !/^Basic\s/.test(authHeader)) {
      return res.status(400).send('missing credentials')
    }
    const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString()
    const [username, password] = decoded.split(':').map(token => token.trim())
    // patch req.body for passport-local
    req.body.username = username
    req.body.password = password
    next()
  }
}

app.post('/auth/mobile/login', basicToLocal(), passport.authenticate('mobile-password'), function (req, res) {
  res.status(200).send()
})

  // get session (user id)
app.get('/internal/session', (req, res, next) => {
  if (req.user) {
    res.json({
      id: req.user.id
    })
  } else {
    return res.status(401).send('User have not logged in')
  }
})

  // get user
app.get('/internal/users', (req, res, next) => {
  res.send([
    { id: 1, username: '18381334402', password: 'root', displayName: 'Jack' },
   { id: 2, username: '18575740461', password: 'root', displayName: 'Jill' }
  ])
})

if (!module.parent) {
  app.listen(3001)
}

module.exports = app
