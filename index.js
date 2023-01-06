require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/Person')


const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

//morgan.token('content', function getContent (req) {return req.body})



app.get('/api/persons', (request, response) => {
    Person.find({}).then(person =>{
        response.json(person)
    })

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
    const body = request.body
    if (!body.name || !body.number){
        response.status(400).json({error: 'name or number missing'})
    }
    else{
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(result => {
            response.json(result)
    })   
}})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})