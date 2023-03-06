//环境变量
const config = require('./utils/config')

const express = require('express')
const app = express()
//该库的“魔力”使我们能够完全消除 Async/await 带来的 try-catch 块。
require('express-async-errors')
const cors = require('cors')

//各个路由，中间件，logger
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const phoneBookRouter = require('./controllers/phoneBook')
const morgan = require('morgan')

//
const mongoose = require('mongoose')
//数据库的地址通过MONGODB_URI环境变量传递给应用。
logger.info('connecting to', config.MONGODB_URI)

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

//中间件函数的调用顺序是它们被 Express 服务器对象的 use 方法所使用的顺序。

//默认情况下,在浏览器中运行的应用的JavaScript代码只能与同一来源的服务器通信。
//我们的服务器在localhost 3001端口,而我们的前端在localhost 3000端口,它们没有相同的起源。
//允许来自所有源的请求。需要放置在REST相关逻辑之前才能生效。
app.use(cors())
//为图片、CSS 文件和 JavaScript 文件等静态文件提供服务
app.use(express.static('build'))
//为了方便地访问数据,我们需要 express json-parser 的帮助
app.use(express.json())
//一个用于输出request信息到控制台的logger
app.use(middleware.requestLogger)

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

//如果请求的 URL 以/api/notes开头，则notesRouter 对象必须只定义路由的相关部分，即空路径/或仅参数/:id。
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/', phoneBookRouter)

//在未知端点中间件发送响应后将不会调用任何路由或中间件。唯一的例外是错误处理程序，它需要在未知端点处理程序之后出现在最后。
app.use(middleware.unknownEndpoint)
//错误处理中间件必须是最后加载的中间件
app.use(middleware.errorHandler)

module.exports = app