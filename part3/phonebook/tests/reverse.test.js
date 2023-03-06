//Jest 默认情况下期望测试文件的名称包含.test。在本课程中，我们将遵循使用扩展名.test.js命名测试文件的约定。

//测试文件导入要测试的函数并将其分配给一个名为reverse的变量
const reverse = require('../utils/for_testing').reverse

//单独的测试用例是用测试函数定义的。该函数的第一个参数是字符串形式的测试描述。第二个参数是一个函数，定义了测试用例的功能。
test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

//执行要测试的代码，意味着为字符串react生成反向
test('reverse of react', () => {
  const result = reverse('react')
  //使用expect函数验证结果.Expect 将结果值包装到一个对象中，该对象提供一组匹配器函数，可用于验证结果的正确性。
  //由于在这个测试用例中我们比较两个字符串，我们可以使用toBe匹配器。
  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})