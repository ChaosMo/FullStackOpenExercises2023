const Persons = ({shownPersons, allPersons, deletePerson}) => {
  if(shownPersons.length !== 0){
    return (
      <ul>
        {shownPersons.map(
        person => (
          <Person key={person.id} person={person} deletePerson={deletePerson}/>
        )
        )}
      </ul>
    )
  }else{
    return (
      <ul>
        {allPersons.map(
        person => (
          <Person key={person.id} person={person} deletePerson={deletePerson}/>
        )
        )}
      </ul>
    )
  }
}

const Person = ({person, deletePerson}) => {
  return (
    <li>
      {person.name}  {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
    </li>
  )
}

export default Persons