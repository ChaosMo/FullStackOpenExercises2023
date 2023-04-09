import { createStore, combineReducers, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import anecdoteReducer from '../reducers/anecdoteReducer'
import notificationReducer from '../reducers/notificationReducer'
import filterReducer from '../reducers/filterReducer'

//6.10 Better anecdotes, step8
const reducer = combineReducers({
    notification: notificationReducer,
    anecdotes: anecdoteReducer,
    filter: filterReducer
})

//6.16 Anecdotes and the backend, step3
const store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
)

export default store