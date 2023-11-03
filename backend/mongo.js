const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const username = 'mateen'
const password = process.argv[2]
const collectionName = 'phonebookApp'
const url = `mongodb+srv://${username}:${password}@cluster0.ljpqviz.mongodb.net/${collectionName}?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
    console.log('phonebook:')
    Person
        .find({})
        .then(res => res.forEach(p => console.log(`${p.name} ${p.number}`)))
        .finally(res => mongoose.connection.close())
}
else if (process.argv.length >= 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({name, number})
    
    person
        .save()
        .then(res => console.log(`added ${name} number ${number} to phonebook`))
        .finally(res => mongoose.connection.close())
}


