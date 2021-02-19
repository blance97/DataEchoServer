import { applyMiddleware, createStore, compose } from "redux";
import rootReducer from "./reducers";
import thunk from 'redux-thunk';


// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
      ),
);
