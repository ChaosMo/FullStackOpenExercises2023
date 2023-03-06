//我们的自定义中间件已移至新的utils/middleware.js模块
//如果我们想让中间件函数在路由事件处理程序被调用前执行,那么就必须在路由之前使用这些中间件函数。
//也有一些情况,我们想在路由之后定义中间件函数。在实践中,这意味着我们要定义的中间件函数只有在没有路由处理 HTTP 请求时才会被调用。

const logger = require('./logger')

//中间件是可以用来处理 request 和 response 对象的函数。之前使用的 json-parser 也是一个所谓的 中间件。在实践中,你可以同时使用几个中间件。
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  //在函数体的最后,调用作为参数传递的 next 函数。这个 next 函数将控制权交给下一个中间件。
  next()
}

//捕捉向不存在的路由发出的请求。对于这些请求,中间件将返回一个 JSON 格式的错误信息。
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//错误处理程序
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    //检查错误是否是CastError异常
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    //不符合schema中的验证规则的对象
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    //令牌可以是错误的，伪造的，或过期的。
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    //在令牌过期的情况下给出一个适当的错误。
    return response.status(401).json({ error: 'token expired' })
  }

  //其他情况下，原样输出并将错误转发给默认的 Express 错误处理程序
  logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}