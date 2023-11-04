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
	else if (err.name === 'ValidationError')
		return res.status(400).json({ error: err.message })
	next(err)
}
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morganMiddleware)

app.get('/info', (req, res, next) => {
	Person
		.find({})
		.then(persons => {
			const numPeople = persons.length
			const date = new Date().toString()
			res.send(`<div>Phonebook has info for ${numPeople} people</div><br /><div>${date}</div>`)
		})
		.catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
	Person
		.find({})
		.then(persons => res.send(persons))
		.catch(err => next(err))
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
		.then(() => res.status(204).end())
		.catch(err => next(err))
})

app.post('/api/persons', async (req, res, next) => {
	const { name, number } = req.body
	const person = new Person({ name, number })
	person
		.save()
		.then(savedPerson => res.json(savedPerson))
		.catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body
	Person
		.findByIdAndUpdate(
			req.params.id,
			{ name, number },
			{ new: true, runValidators: true, context: 'query' }
		)
		.then(updatedPerson => res.json(updatedPerson))
		.catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}...`)
})