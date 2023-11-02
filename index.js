const express = require('express')
const morgan = require('morgan')
const app = express()

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(morgan('tiny'))

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
	console.log('getting info...')
	const numPeople = phonebook.length
	const date = new Date().toString()

	res.send(`<div>Phonebook has info for ${numPeople} people</div><br /><div>${date}</div>`)
})

app.get('/api/persons', (req, res) => {
	console.log('getting persons from phonebook...') // debug
  res.send(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	console.log(`getting person with id: ${id}...`) // debug
	const person = phonebook.find(p => p.id === id)

	if (person)
		res.send(person)
	else
		res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	console.log(`deleting person with id: ${id}`) // debug

	phonebook = phonebook.filter(p => p.id !== id)
	res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	console.log('creating a new person entry...') // debug
	const { name, number } = req.body
	if (!name)
		return res.status(400).json({error: 'name missing'})
	else if (!number)
		return res.status(400).json({error: 'number missing'})
	else if (phonebook.map(p => p.name).includes(name))
		return res.status(400).json({error: 'name must be unique'})

	const person = {
		id: Math.floor(Math.random()*1000000),
		name: name,
		number:number,
	}
	
	phonebook = phonebook.concat(person)
	res.send(person)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
   console.log('Server running on port 3001...') // debug
})