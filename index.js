require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if(error.name === 'ReferenceError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}



//morgan.token('content', function getContent (req) {return req.body})



app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })

})

app.get('/api/info', (request, response) => {
  Person.find({}).then(person => {
    response.send(`<p>Phonebook has info for ${person.length} people</p> <p> ${Date()} </p>`)
  })
}
)

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        person.deleteOne()
        response.status(204).end()
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    response.status(400).json({ error: 'name or number missing' })
  }
  if (Person.findOne({ name: body.name })){
    response.status(400).json({ error: 'A person with that name aleady exists' })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(result => {
      response.json(result)
    })
  }



})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})