import { useState } from 'react'

const Statistics = (props) => {
  if (props.sum === 0 && props.title === true) {
    return (
      <tr>
        <td>No feedback given</td>
      </tr>
    )
  }

  if (props.sum === 0) {
    return
  }

  return (
    <tr>
    <td align="left">{props.name}</td>
    <td align="left">{props.data}</td> 
    </tr>
  )
}

const Button = ({ handleClick, text }) => (  
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <h1>statistics</h1>
        <table>
        <tbody>
        <Statistics title={true} sum={good+bad+neutral}/>
        <Statistics name="good" sum={good+bad+neutral} data={good}/>
        <Statistics name="neutral" sum={good+bad+neutral} data={neutral}/>
        <Statistics name="bad" sum={good+bad+neutral} data={bad}/>
        <Statistics name="average" sum={good+bad+neutral} data={(good-bad)/(good+bad+neutral)}/>
        <Statistics name="positive" sum={good+bad+neutral} data={((good)/(bad+good+neutral)*100).toFixed(2)+'%'}/>
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default App