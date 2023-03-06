//到目前为止，我们一直在使用console.log和console.error从代码中打印不同的信息。但是，这不是一个很好的方式。
//让我们将所有打印到控制台的内容分离到它自己的模块utils/logger.js 中

//输出有关 HTTP 请求的信息的中间件阻碍了测试执行输出。让我们修改记录器，使其不会在测试模式下打印到控制台
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}


module.exports = {
  info, error
}

//从多个方面来说，将日志提取到它自己的模块中是一个好主意。
//如果我们想开始将日志写入文件或将它们发送到外部日志记录服务（如graylog或papertrail），我们只需在一个地方进行更改。