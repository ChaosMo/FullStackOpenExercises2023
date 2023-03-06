const average = require('../utils/for_testing').average

//围绕命名为average的测试定义了一个describe块,它可用于将测试分组到逻辑集合中
//当我们想要为一组测试运行一些共享设置或拆卸操作时， describe块是必需的。
describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})