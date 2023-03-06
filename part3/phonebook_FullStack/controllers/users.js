//实现一个创建新用户的路由。用户有一个唯一的用户名、一个名字和一个叫做passwordHash的东西。
//passwordHash是应用于用户密码的单向哈希函数的输出。将未加密的纯文本密码存储在数据库中绝不明智！安装用于生成passwordHash的bcrypt包

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//添加一个路由处理程序的初始实现，该处理程序返回数据库中的所有用户
usersRouter.get('/', async (request, response) => {
  //Mongoose 连接是使用populate方法完成的。与关系数据库中的连接查询不同，后者是事务性的，这意味着在进行查询期间数据库的状态不会改变。
  //使用 Mongoose 中的连接查询，没有什么可以保证被连接的集合之间的状态是一致的，这意味着如果我们进行连接用户和笔记集合的查询，则集合的状态可能会在查询期间发生变化。
  //在进行初始查询的 find 方法之后。传递给 populate 方法的参数定义了用户文档的注释字段中“引用注释对象的id”将被“引用的注释文档”替换。
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })//我们可以使用 populate 参数来选择我们想要从文档中包含的字段。字段的选择是用 Mongo语法完成的
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //Mongoose 没有用于检查字段唯一性的内置验证器。原则上，我们可以从mongoose-unique-validator npm 包中找到现成的解决方案
  //但不幸的是，在撰写本文时（2022 年 1 月 24 日），mongoose-unique-validator 不适用于 Mongoose 版本 6.x，因此我们必须在控制器中自己实现唯一性检查
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  //我们还可以在用户创建中实施其他验证。我们可以检查用户名是否足够长，用户名是否只包含允许的字符，或者密码是否足够强

  //当您对数据进行哈希处理时，该模块将经过一系列回合为您提供安全的哈希处理。
  //您提交的值不是模块对您的数据进行哈希处理的轮数。该模块将使用您输入的值并进行2^rounds哈希迭代。
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //密码未存储在数据库中。仅存储使用bcrypt.hash函数生成的密码哈希值
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter