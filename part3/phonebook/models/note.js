const mongoose = require('mongoose')

//建立与数据库的连接的责任已交给app.js模块。models目录下的note.js文件只定义了笔记的 Mongoose schema。

//为Note定义Schema。Schema中的每个字段可定义特定的验证规则，避免接受属性缺失或为空的笔记。
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean,
  //扩展models/note.js文件中定义的笔记的架构，以便笔记包含有关创建它的用户的信息
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

//我们不想把mongo的版本字段__v返回给前台。格式化Mongoose返回的对象的一种方法是修改模式的toJSON方法,该方法用于用该模式生成的模型的所有实例。
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    //尽管Mongoose对象的id属性如下所示:一个字符串,但它实际上是一个对象。为了安全起见,我们定义的toJSON方法将其转化为一个字符串。
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//为Note设置匹配的模型、将其作为输出。第一个"Note"参数将是模型的单数名称。集合的名称将是小写的复数notes
module.exports = mongoose.model('Note', noteSchema)

//定义Node的模块与定义ES6模块的方式略有不同。模块的公共接口是通过给module.exports变量设置一个值来定义的。
//其他定义在模块内部的东西,如变量mongoose和url将不会被模块的用户访问或看到。