//环境变量的处理被提取到一个单独的utils/config.js文件中
//在.env文件中定义的环境变量可以用表达式require(''dotenv').config()来使用
require('dotenv').config()

const PORT = process.env.PORT

//对开发和测试数据库的数据库地址有单独的变量
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}