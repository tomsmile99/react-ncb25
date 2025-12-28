import { combineReducers } from 'redux'
import { userReducer } from './userStores'

const rootReducer = combineReducers({
  userAuth : userReducer
})

export default rootReducer