//我们应用程序的逻辑非常简单，用单元测试进行测试没有太多意义。
//让我们创建一个新文件utils/for_testing.js并编写一些我们可以用于测试编写练习的简单函数

const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  //average函数使用数组reduce方法
  //在 JavaScript 中除以零会导致NaN
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}