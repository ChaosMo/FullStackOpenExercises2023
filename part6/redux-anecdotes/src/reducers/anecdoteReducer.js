import anecdoteService from '../services/anecdotes'

//6.6: anecdotes, step4
//6.11 Better anecdotes, step9
const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'VOTE': {
      const id = action.data.id
      const updatedAnecdote = state.find(anecdote => anecdote.id === id)
      const changedAnecdote = {
        ...updatedAnecdote,
        votes: updatedAnecdote.votes + 1
      }
      return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
     }
    default:
      return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}
//6.4: anecdotes, step2
//6.17 Anecdotes and the backend, step4
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}
//6.3: anecdotes, step1
//6.18 Anecdotes and the backend, step5
export const vote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update({...anecdote, votes: anecdote.votes + 1})
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote,
    })
  }
}

export default anecdoteReducer