import { useState, useEffect } from 'react'
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from './components/Notification'
import personService from './services/personService';

const App = () => {
  const [allPersons, setAllPersons] = useState([])
  const [shownPersons, setShownPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setAllPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = allPersons.filter((person) =>
        person.name === newName
    )

    if (person.length !== 0) {
      const personToAdd = person[0]
      const updatedPerson = { ...personToAdd, number: newNumber }
      
      if (window.confirm(`${personToAdd.name} is already added to the phonebook, replace the old number with a new one ?`)) {
        personService
          .update(updatedPerson.id, updatedPerson).then(returnedPerson => {
            console.log(`${returnedPerson.name} successfully updated`)
            setAllPersons(allPersons.map(personItem => personItem.id !== personToAdd.id ? personItem : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(
              `${updatedPerson.name} was successfully updated`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch((error) => {
            console.log(error)
            setAllPersons(allPersons.filter(person => person.id !== updatedPerson.id))
            setNewName('')
            setNewNumber('')
            setMessage(
              `[ERROR] ${updatedPerson.name} was already deleted from server`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
        const personToAdd = {
            name: newName,
            number: newNumber
          }
          personService
            .create(personToAdd)
            .then(returnedPerson => {
              setAllPersons(allPersons.concat(returnedPerson))
              setNewName('')
              setNewNumber('')
              setMessage(
                `${newName} was successfully added`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              setMessage(
                `[ERROR] ${error.response.data.error}`
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              console.log(error.response.data)
            })
    }
  }

  const deletePerson = (id) => {
    const deletePerson = allPersons.find(person => person.id === id)
    if (window.confirm(`Delete ${deletePerson.name} ?`)) {
      personService
        .remove(deletePerson.id)
      setAllPersons(allPersons.filter(person => person.id !== deletePerson.id))
    }
  }

  const handlefilterChange = (event) => {
    // 即使set了state，在执行完之前获取到的是set前的state，所以用event.target.value
    const filterPersons = allPersons.filter(person => person.name.toUpperCase().includes(event.target.value.toUpperCase()))
    setShownPersons(filterPersons)
    setFilter(event.target.value)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <Notification message={message} />
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handlefilterChange}> </Filter>
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      <Persons shownPersons={shownPersons} allPersons={allPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App