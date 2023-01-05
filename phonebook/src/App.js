import { useEffect, useState } from 'react'
import numberService from './services/numbers'
import './index.css'

const Show = (props) =>
  <><p>{props.name} {props.number}</p></>

const Persons = (props) => {
  return (<>{props.numbersToShow.map((name) =>
    <div key={name.name}> <Show name={name.name} number={name.number} />
      <button onClick={() => {
        if (window.confirm(`Delete ${name.name} ?`)) {
          numberService
            .remove(name.id)
            .then(props.get)
          props.setSuccess(`Deleted ${name.name}`)

          setTimeout(() => {
            props.setSuccess(null)
          }, 5000)
        }

      }}>
        delete</button>
    </div>
  )
  }
  </>)
}

const PersonForm = (props) => {
  return (<form>
    <div>
      name: <input value={props.newName}
        onChange={(track) => { props.setNewName(track.target.value) }} />
      <br />
      number: <input value={props.newNumber}
        onChange={(track) => { props.setNewNumber(track.target.value) }} />


      <br></br>
      <button type="submit"
        onClick={(event) => {
          event.preventDefault()
          if (props.persons.some(person => person.name === props.newName)) {

            window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`)
            numberService
              .update(props.persons[(props.persons.findIndex(x => x.name === props.newName))].id, { name: props.newName, number: props.newNumber })
              .then((f) => {
                props.setNewNumber('')
                props.setNewName('')
                props.get()
                props.setSuccess(`${props.newName}'s number was succesfully changed`)
                setTimeout(() => {
                  props.setSuccess(null)
                }, 5000)
              })
              .catch((j) => {
                props.setError(`Information of ${props.newName} has already been removed from server`)
                setTimeout(() => {
                  props.setError(null)
                }, 5000)
              }
              )

          }

          if(props.newName === '' || props.newNumber === ''){
            props.setError(`name or number missing`)
                setTimeout(() => {
                  props.setError(null)
                }, 5000)
          }
          else {
            props.setPersons(props.persons.concat([{ name: props.newName, number: props.newNumber }]))
            numberService
              .create({ name: props.newName, number: props.newNumber })
              .then(props.setSuccess(`Added ${props.newName}`))
              .then(props.setNewName(''))
              .then(props.setNewNumber(''))
              .then(props.get)
            setTimeout(() => {
              props.setSuccess(null)
            }, 5000)
          }
        }}>
        add
      </button>
    </div>
  </form >)
}

const Filter = (props) => {
  return (<form>
    <div>
      filter shown with
      <input
        value={props.filter}
        onChange={(track) => {
          props.setNewFilter(track.target.value)
        }
        }
      />
    </div>
  </form>)
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Successnotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const get = () => {
    numberService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  const numbersToShow =
    persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  useEffect(() => {
    get()
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Successnotification message={successMessage} />
      <Filter filter={filter} setNewFilter={setNewFilter} />
      <h2>add a new</h2>
      <PersonForm setNewName={setNewName} setNewNumber={setNewNumber}
        persons={persons} setPersons={setPersons} newName={newName}
        get={get} newNumber={newNumber} setError={setErrorMessage}
        setSuccess={setSuccessMessage} errorMessage={errorMessage} />
      <h2>Numbers</h2>
      <Persons numbersToShow={numbersToShow} get={get}
        setError={setErrorMessage} setSuccess={setSuccessMessage} />
    </div >
  )

}

export default App