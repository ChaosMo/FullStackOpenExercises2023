const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

//我们还提前定义了nonExistingId函数，可以用来创建一个不属于数据库中任何笔记对象的数据库对象ID。
const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

//该模块定义了notesInDb函数，可用于检查存储在数据库中的笔记。包含初始数据库状态的initialNotes数组也在模块中。
const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

//该函数用于帮助我们在创建用户后验证数据库的状态
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}