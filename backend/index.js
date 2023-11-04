require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const morganMiddleware = morgan(function (tokens, req, res) {
	const body = JSON.stringify(req.body)
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		body === '{}' ? null : body,
	].join(' ')
})

const errorHandler = (err, req, res, next) => {
	console.error(err.message)
	if (err.name === 'CastError')
		return res.status(400).send({ error: 'malformatted id' })
	next(err)
}
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morganMiddleware)

let phonebook = [
	{ 
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
	},
	{ 
		"id": 5,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	},
]

app.get('/info', (req, res) => {
	// TODO
	const numPeople = phonebook.length
	const date = new Date().toString()

	res.send(`<div>Phonebook has info for ${numPeople} people</div><br /><div>${date}</div>`)
})

app.get('/api/persons', (req, res, next) => {
	Person
		.find({})
		.then(persons => res.send(persons))
		// .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if (person) res.json(person)
			else res.status(404).end()
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person
		.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).end())
		.catch(err => next(err))
})

app.post('/api/persons', async (req, res) => {
	const { name, number } = req.body
	if (!name)
		return res.status(400).json({error: 'name missing'})
	else if (!number)
		return res.status(400).json({error: 'number missing'})

	const person = new Person({
		name: name,
		number:number,
	})
	person
		.save()
		.then(savedNote => res.send(savedNote))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}...`) // debug
})