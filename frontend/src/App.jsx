import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonDisplay from './components/PersonDisplay'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState({ status: 'clear', text: '' })

  useEffect(() => {
    personService
      .getAll()
      .then(data => setPersons(data))
      .catch(err => {
        console.log(err) // debug
        setMessage({status: 'error', text: 'Phonebook database was not able to be retreived'})
        setTimeout(() => setMessage({status: 'clear', text: ''}), 3000)
    })
  }, [])

  const handleChangeName = event => {
    console.log('name: ', event.target.value); //debug 
    setNewName(event.target.value);
  }
  const handleChangeNumber = event => {
    console.log('number: ', event.target.value); //debug
    setNewNumber(event.target.value); 
  }

  const handleChangeFilter = event => {
    console.log('filter: ', event.target.value); //debug
    setNewFilter(event.target.value);
  }

  const clearInputs = () => {setNewName(''); setNewNumber('');}

  const addTempNotice = (state, text) => {
    setMessage({status: state, text: text});
    setTimeout(() => setMessage({status: 'clear', text: ''}), 3000)
  }

  const addPerson = event => {
    event.preventDefault();
    if (newName === '') return;

    if (persons.map(person => person.name).includes(newName))
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`))
        return editNumber()
      else
        return

    const personObject = {name: newName, number: newNumber};
    personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data));
        addTempNotice('success', `Added ${newName}`)
        clearInputs();
      })
      .catch(err => {
        console.log(err) // debug
        addTempNotice('error', `${newName} was not able to be added to the server`)
      })
  }

  const editNumber = () => {
    const personObject = {name: newName, number: newNumber}
    const id = persons.find(person => person.name === newName).id
    
    personService
      .update(personObject, id)
      .then(data => {
        setPersons(persons.map(p => p.id === id ? data : p))
        addTempNotice('success', `Changed ${newName}'s number`)
        clearInputs();
      })
      .catch(err => {
        console.log(err) // debug
        addTempNotice('error', `Information of ${newName} was not found in the server`)
      })
  }

  const deletePerson = id => {
    const name = persons.find(person => person.id === id).name
    if (!window.confirm(`Delete ${name}?`)) return

    personService
      .remove(id)
      .then(() => {
        const newPersons = [...persons].filter(person => person.id !== id)
        setPersons(newPersons)
        addTempNotice('success', `Deleted ${name}`);
      })
      .catch(err => {
        console.log(err) // debug
        addTempNotice('error', `Information of ${name} has already been removed from the server`)
      })
  }

  const personsToShow = (newFilter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />

      <Filter 
        handleChangeFilter={handleChangeFilter} 
        newFilter={newFilter} 
      />

      <h3>add a new</h3>
      <PersonForm 
        handleSubmit={addPerson}
        handleChangeName={handleChangeName}
        handleChangeNumber={handleChangeNumber}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <PersonDisplay 
        persons={personsToShow} 
        handleDelete={deletePerson}
      />
    </div>
  )
}

export default App
