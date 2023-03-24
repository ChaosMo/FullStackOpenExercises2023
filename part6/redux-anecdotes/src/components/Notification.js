import React from 'react'
import { useSelector } from 'react-redux'

//6.12 Better anecdotes, step10
const Notification = () => {
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (notification === null) {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification