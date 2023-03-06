const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

//当一个应用试图连接到一个还不存在的数据库时，MongoDB Atlas会自动创建一个新的数据库。
const url =`mongodb+srv://al17073:${password}@cluster0.aik4lsr.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})
//如果你定义了一个名字为Person的模型，mongoose会自动将相关的集合命名为people。
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  //当代码以命令node mongo.js password运行时，检索数据库
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}else{
  //当代码以命令node mongo.js password name number运行时，作为条目保存到数据库
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}