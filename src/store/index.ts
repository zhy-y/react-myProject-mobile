import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore
} from 'redux'
import { loginReducer } from './reducers/login'
import { profileReducer } from './reducers/profile'
import { channelReducer } from './reducers/channel'
import { articleReducer } from './reducers/article'
import { searchReducer } from './reducers/search'
import { commentReducer } from './reducers/comment'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// 组合根reducer
const reducer = combineReducers({
  login: loginReducer,
  profile: profileReducer,
  channel: channelReducer,
  article: articleReducer,
  search: searchReducer,
  comment: commentReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
export default store
