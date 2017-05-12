const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const path = require('path')
const admin = require("firebase-admin");

const app = express()
const PORT = process.env.port || 3000
const serviceAccount = require('./admin.config.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://solar-902cc.firebaseio.com"
})

const db = admin.database().ref('users')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/signup', (req, res) => {
  console.log('hello!', req.body);
  const email = req.body.email
  const id = uuid()
  db.set({
    email
  })
  .then((response) => {
    console.log('response', response);
    res.sendStatus(200)
  })
  .catch((err) => {
    console.log('err', err);
    res.sendStatus(400)
  })
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

app.listen(PORT, () => console.log(`\nRunning on port ${PORT}\n`))
