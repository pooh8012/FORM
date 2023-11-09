const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { config } = require('dotenv')

const app = express()
config()

const port = process.env.PORT || 3000

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.wnahaxt.mongodb.net/registrationFormDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const Registation = mongoose.model('Registration', registrationSchema)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html')
})

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await Registation.findOne({ email: email })

    if (!existingUser) {
      const registrationData = new Registation({
        name,
        email,
        password
      })
      await registrationData.save()
      res.redirect('/success')
    } else {
      console.log('User exits already')
      res.redirect('/error')
    }
  } catch (error) {
    console.log(error)
    res.redirect('/error')
  }
})

app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/pages/success.html')
})
app.get('/error', (req, res) => {
  res.sendFile(__dirname + '/pages/error.html')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
