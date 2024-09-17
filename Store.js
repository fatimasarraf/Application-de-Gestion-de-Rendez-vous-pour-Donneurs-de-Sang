import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import authReducer from './authReducer'; 

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
