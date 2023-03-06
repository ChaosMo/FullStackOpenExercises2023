//路由处理程序也已移至专用模块中。路由的事件处理程序通常称为controllers，因此我们创建了一个新的controllers目录。
//所有与笔记相关的路由现在都在controllers目录下的notes.js模块中。

//我们创建了一个新的Router对象,为它定义了所有路由，类似于之前对代表整个应用程序的对象所做的，它实际上也是一个中间件
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

//约定俗成的是,GET 和 HEAD 方法不应具有除检索以外的行动意义
notesRouter.get('/',async  (request, response) => {
  //ES7 中引入的 async/await 语法，使使用异步函数成为可能，这些异步函数以一种使代码看起来同步的方式返回 promise 。
  //代码的执行在await处暂停，等待相关的 promise完成，然后继续执行到下一行。当执行继续时，promise被分配给notes变量。
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })//我们还可以在note中添加合适的用户信息
    //populate方法的功能基于我们已经使用ref选项为 Mongoose schema中的引用定义了“类型”

  //then链没问题，但我们可以做得更好。
  // Note.find({}).then(notes => {
  // })

  //当响应以JSON格式发送时,数组中每个对象的toJSON方法被JSON.stringify方法自动调用。
  response.json(notes)
})

//使用冒号语法为 Express 中的路由定义 参数
notesRouter.get('/:id',async (request, response) => {
  // //把 id 参数从一个字符串变成一个数字
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)
  // //如果没有找到笔记,服务器应该用状态代码 404 not found 来响应,而不是 200
  // //所有的 JavaScript 对象都是 truthy,意味着它们在比较操作中计算为真。然而,undefined 是 falsy,这意味着它将被计算为假。
  // if (note) {
  //   response.json(note)
  // } else {
  //   //由于响应中没有附加数据,我们使用 status 方法来设置状态,并使用 end 方法来响应请求,而不发送任何数据。
  //   response.status(404).end()
  // }

  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

  // Note.findById(request.params.id)
  //   .then(note => {
  //     if (note) {
  //       response.json(note)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => {
  //   //在某些情况下,最好在一个地方实现所有错误处理。如果我们稍后想要向外部错误跟踪系统（如Sentry ）报告与错误相关的数据，这将特别有用。
  //   //如果next在没有参数的情况下被调用,那么执行将简单地移动到下一个路由或中间件。如果带有参数，那么执行将继续到错误处理中间件。
  //     next(error)
  //     //如果将错误记录到控制台，则可以避免冗长且令人沮丧的调试会话
  //     console.log(error)
  //     //如果 id 的格式不正确,那么我们将在catch块中定义的错误处理程序中结束。这种情况的适当状态代码是400 Bad Request,因为这种情况完全符合描述
  //     response.status(400).send({ error: 'malformatted id' })
  //   })
})

notesRouter.delete('/:id',async (request, response) => {
  //从数据库中删除笔记的最简单方法是使用findByIdAndRemove方法
  await Note.findByIdAndRemove(request.params.id)
  //如果删除资源是成功的,也就是说,笔记存在并且被删除了,我们用状态代码 204 无内容 来响应请求,并且在响应中不返回数据
  response.status(204).end()
  //对于在资源不存在的情况下应该向 DELETE 请求返回什么状态码,目前还没有达成共识。实际上,唯一的两个选择是 204 和 404。
})

// const generateId = () => {
//   //找出当前列表中最大的 ID 号码,新笔记的 id 将被定义为 maxId+1
//   //一个数组可以通过使用 spread 语法 ... 转换为多个数字的形式,用于参数传入
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

//将令牌从授权头中分离出来
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

//只有在request附有有效的令牌时才可创建新笔记。然后该笔记被保存到由令牌识别的用户的笔记列表中。
notesRouter.post('/',async (request, response) => {
  //如果没有 json-parser,body 属性将是未定义的。json-parser 的功能是将请求的 JSON 数据转化为 JavaScript 对象。
  const body = request.body

  const token = getTokenFrom(request)
  //用jwt.verify检查令牌的有效性。该方法还对令牌进行解码
  const decodedToken = jwt.verify(token, process.env.SECRET)
  //从令牌解码的对象应该包含用户名和id字段。
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // //定义 content 属性不得为空
  // if (body.content === undefined) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  //查找该用户id，获取DB中的整个user对象
  const user = await User.findById(decodedToken.id)
  //根据模型的Schema,填入对应内容,实例化一个对象
  const note = new Note({
    content: body.content,
    //如果保存在 body 变量中的数据有 important 属性,表达式将计算为其值。
    important: body.important === undefined ? false : body.important,
    //在服务器上生成时间戳比在浏览器中生成时间戳更好,因为我们不能相信运行浏览器的主机有正确的时钟设置
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  //值得注意的是，user对象也发生了变化。当前note的id存储在notes字段中
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  //创建成功的状态码应该是201
  response.status(201).json(savedNote)
  //使用Async/await 稍微优化了代码，但“代价”是捕获异常所需的try/catch结构。
  //这可以用express-async-errors库代劳。如果异步路由中发生异常，执行将自动传递给错误处理中间件。
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const note = {
    //基于业务逻辑,不接受date的传入
    content: body.content,
    important: body.important,
  }
  //使用findByIdAndUpdate方法,轻松改变note属性。
  //默认情况下,updatedNote参数接收未经修改的原始文档。我们添加了可选{ new: true }参数,这将导致updatedNote接收修改后的新文档。
  //执行 findOneAndUpdate 时默认不运行验证。需要设置{ runValidators: true, context: 'query' }
  Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter