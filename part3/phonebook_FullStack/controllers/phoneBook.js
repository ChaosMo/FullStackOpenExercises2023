const phoneBookRouter = require('express').Router()
const Person = require('../models/person')

phoneBookRouter.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

phoneBookRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

phoneBookRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

phoneBookRouter.post('/api/persons', (request, response, next) => {
  const body = request.body
  const personName = body.name
  const personNumber = body.number

  if(Object.keys(body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // if(personName === undefined || personNumber === undefined){
  //   return response.status(404).send({ error: 'lacking of personName or personNumber' })
  // }
  // if(Person.find(person => person.name === personName)){
  //   return response.status(404).send({ error: 'name must be unique' })
  // }

  const person = new Person({
    name: personName,
    number: personNumber
  })

  person.save()
    .then(savedPerson =>  savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

phoneBookRouter.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

phoneBookRouter.get('/info', (request, response) => {
  const currentDate = new Date().toLocaleString()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  Person.find({}).then(persons => {
    response.send(
      `
      <div>
          <p>Phonebook has info for ${persons.length} people</p>
      </div>
      <div>
          <p>${currentDate} (${timeZone})</p>
      </div>`
    )
  })
})
module.exports = phoneBookRouter