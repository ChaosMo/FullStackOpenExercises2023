const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  //通过用户名从数据库中搜索用户
  const user = await User.findOne({ username })
  //密码本身没有被保存，数据库中保存的是密码中计算出的哈希，bcrypt.compare方法被用来检查密码是否正确。
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  //如果没有找到用户，或者密码不正确，请求将以状态代码401 unauthorized响应。
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  //如果密码正确，会用jwt.sign方法创建一个令牌。该令牌以数字签名的形式包含用户名和用户ID。该令牌用环境变量SECRET中的字符串作为secret的数字签名。
  //限制令牌的有效期为1小时。
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  //一个成功的请求会以状态代码200 OK得到响应。生成的令牌和用户的用户名会在响应体中被送回来。
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter