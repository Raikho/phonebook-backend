const express = require('express')

const app = express()
app.use(express.json())


const phonebook = [
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
	}
]

app.get('/api/persons', (req, res) => {
	console.log('getting persons from phonebook...')
  res.send(phonebook)
})

app.get('/info', (req, res) => {
	console.log('getting info...')
	const numPeople = phonebook.length
	const date = new Date().toString()

	res.send(`<div>Phonebook has info for ${numPeople} people</div><br /><div>${date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	console.log(`getting person with id: ${id}...`)
	const person = phonebook.find(person => person.id === id)
	if (person)
		res.send(person)
	else
		res.status(404).end()
})


const PORT = 3001
app.listen(PORT, () => {
   console.log('Server running on port 3001...')
})