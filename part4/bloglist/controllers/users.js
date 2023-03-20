const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//4.15: bloglist expansion, step3
usersRouter.post('/', async (request, response) => {
  const body = request.body

  //4.16*: bloglist expansion, step4
  if (body.password.length < 3) {
    return response.status(400).json({ error: `User validation failed: username: Path password is shorter than the minimum allowed length (3)` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users.map(user => user.toJSON()))
  })

module.exports = usersRouter