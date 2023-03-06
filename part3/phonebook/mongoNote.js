const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

//当一个应用试图连接到一个还不存在的数据库时，MongoDB Atlas会自动创建一个新的数据库。
const url =
  `mongodb+srv://al17073:${password}@cluster0.aik4lsr.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

//为Note定义模式和匹配的模型
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
//第一个"Note"参数是模型的单数名称。集合的名称将是小写的复数notes
const Note = mongoose.model('Note', noteSchema)

//像Mongo这样的文档数据库是无模式，意味着数据库本身并不关心存储在数据库中的数据结构。有可能在同一个集合中存储具有完全不同字段的文档。
//Mongoose背后的想法是，存储在数据库中的数据在应用层面上被赋予了一个schema，它定义了存储在任何给定集合中的文档的形状。

//实例化一个Note对象，保存到DB
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})
note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})

//数据库检索,需要注释掉上方的save才调用
//对象是用Note模型的find方法从数据库中检索出来的。该方法的参数是一个表达搜索条件的对象。
//我们可以限制我们的搜索，只包括重要的笔记，Note.find({ important: true })
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

//当代码以命令node mongo.js password运行时，将向数据库添加一个新的文档。