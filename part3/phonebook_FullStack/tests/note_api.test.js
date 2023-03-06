const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//使用supertest函数将app包装到所谓的superagent对象中。该对象被分配给api变量，测试可以使用它向后端发出 HTTP 请求
//测试仅使用app.js文件中定义的快速应用程序。而没有用index.js文件的 Node 内置的http对象在指定端口启动应用程序。
//如果服务器尚未侦听连接，supertest会绑定到一个临时端口，因此无需跟踪端口。确保了被测试的应用程序在其内部使用的端口上启动
const api = supertest(app)

//为了使我们的测试更加健壮，我们必须在运行测试之前重置数据库并以受控方式生成所需的测试数据。
const Note = require('../models/note')

const helper = require('./test_helper')

//如果我们用describe块来分组相关的测试，测试的可读性会得到改善。
describe('when there is initially some notes saved', () => {

  //数据库一开始被清空，之后我们将initialNotes数组中存储的两条笔记存入数据库
  //大量数据场景时，如果需要执行forEach循环操作，需要注意：forEach内部定义的await命令不在beforeEach函数中，而是在beforeEach不会等待的单独函数中。
  //解决此问题的一种方法是使用Promise.all方法等待所有异步操作完成执行
  beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes
      .map(note => new Note(note))
    //创建一个 promise的数组
    const promiseArray = noteObjects.map(note => note.save())
    //Promise.all方法可用于将承诺数组转换为单个承诺，await等待每个保存note的promise完成
    await Promise.all(promiseArray)

    //Promise.all 并行执行它收到的承诺。如果承诺需要以特定顺序执行，这将是有问题的。在这种情况下，操作可以在for...of块内执行，以保证特定的执行顺序。
    // for (let note of helper.initialNotes) {
    //   let noteObject = new Note(note)
    //   await noteObject.save()
    // }
  })
  //通过这样做，我们确保在运行每个测试之前数据库处于相同状态。


  test('notes are returned as json', async () => {
    //Async/await 语法可用于编写具有同步代码外观的异步代码。
    await api
      .get('/api/notes')//测试向api/notes url发出 HTTP GET 请求
      .expect(200)//验证请求是否以状态码 200 响应。
      .expect('Content-Type', /application\/json/)//测试还验证Content-Type标头是否设置为application/json
  })


  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    //使用Jest的expect方法来验证响应数据的格式和内容
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    //该response.body.map(r => r.content)命令用于创建一个数组，其中包含 API 返回的每个注释的内容。
    //toContain方法用于检查作为参数提供给它的注释是否在 API 返回的注释列表中。
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('addition of a new note', () => {
  //编写一个测试来添加一条新笔记，并验证 API 返回的笔记数量是否增加以及新添加的笔记是否在列表中
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //通过获取应用程序的所有注释来检查保存操作后存储在数据库中的状态
    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  //编写一个测试来验证没有内容的笔记不会被保存到数据库中
  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('viewing a specific note', () => {

  test('succeeds with a valid id', async () => {
    //在初始化阶段，他们从数据库中获取一个注释
    const notesAtStart = await helper.notesInDb()
    //此后，测试调用被测试的实际操作
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    //最后，测试验证操作的结果是否符合预期
    //作为响应主体接收到的note对象经过 JSON 序列化和解析。此处理会将date属性值的类型从Date对象转换为字符串。
    //因此无法直接比较resultNote.body和noteToView是否相等。必须首先对noteToView执行类似的 JSON 序列化和解析
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })

})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

//一旦所有测试（目前只有一个）运行完毕，我们必须关闭 Mongoose 使用的数据库连接,用jest的afterAll方法轻松实现
afterAll(() => {
  mongoose.connection.close()
})