import React from 'react'

const Header = ({name}) => {
  return (
    <h1>{name}</h1>
  )
}

const Part = ({name,exercises}) => {
  return (
    <p>
    {name} {exercises}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <>
    {parts.map(
      part => <Part key={part.id} name={part.name} exercises={part.exercises} />
    )}
    </>
  )
}

const Total = ({parts}) => {
  const initialValue = 0;
  const total = parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    initialValue
  )

  return (
    <p>total of {total} exercises</p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

export default Course