const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
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
  console.log('/',req.headers);
  res.send('root Hello World')
})

app.get('/test', function (req, res) {
  console.log('/',req.headers);
  res.send('/test Hello World ')
})

app.put('/put', function (req, res) {
  console.log('/',req.headers);
  res.send('/put Hello World ')
})

// Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
const basicToLocal = () => {
 return (req,res,next) => {
   console.log('basictolocal',req.body)
   req.body.username = req.body.username
   req.body.password = req.body.password 
   next()	
 }
/* 
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
*/	

}

app.post('/auth/mobile/login', basicToLocal(), passport.authenticate('mobile-password'), function (req, res) {
  console.log('/auth/mobile/login',req.headers);
  const  payload = {
    "iss": "a36c3049b36249a3c9f8891cb127243c"
  }
  let token = jwt.sign(payload, 'e71829c351aa4242c2719cbfbe671c09');
  res.status(200).send(token)
})

  // get session (user id)
app.get('/internal/session', (req, res, next) => {
  console.log('/internal/session',req.headers);
  console.log('/internal/session req',req);
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
  console.log('/internal/users',req.headers);
  res.send([
    { id: 1, username: '18381334402', password: 'root', displayName: 'Jack' },
   { id: 2, username: '18575740461', password: 'root', displayName: 'Jill' }
  ])
})

if (!module.parent) {
  app.listen(3001)
}

module.exports = app
