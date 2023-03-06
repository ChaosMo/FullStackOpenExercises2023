//我们决定将用户创建的note的 ID 存储在用户文档中
//引用现在存储在两个文档中：笔记引用了创建它的用户，并且用户拥有对他们创建的所有笔记的引用数组

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  //note的 ID 作为 Mongo ID 数组存储在用户文档中。
  //该字段的类型是“引用note样式文档”的ObjectId 。Mongo 本身并不知道这是引用注释的字段，语法纯粹与 Mongoose 相关并由 Mongoose 定义
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User