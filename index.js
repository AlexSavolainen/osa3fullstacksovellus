const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('content', function getContent (req) {return req.body})

let persons = [{
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
},
{
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
},
{
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
},
{
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
}]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p> ${Date()} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person =>
        person.id === id)
    if (person === undefined) {
        response.status(404).end()
    }
    else {
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person =>
        person.id !== id)
        response.status(204).end()
    
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name || !person.number){
        response.status(400).json({error: 'name or number missing'})
    }
    if (persons.some(x => x.name === person.name)){
        response.status(400).json({error: 'name already in list'})
    }
    else{
    person.id = Math.floor(Math.random()*10000)
    persons = persons.concat(person)
    response.json(person)
    console.log(person)
    }   
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})