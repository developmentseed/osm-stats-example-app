'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers/reducer';
import config from './config';
import App from './containers/App';

// logger that logs to console actions and state updateas during redux store updates.
const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});
// create store with the above logger and thunk middleware so async actions are possible for store updates
const finalCreateStore = compose(
  applyMiddleware(logger, thunkMiddleware)
)(createStore);

const store = finalCreateStore(reducer);

// render the app view wrapped in a Provider component, which allows for connectionb between react/redux
render((
    <Provider store={store} >
      <App />
    </Provider>
), document.querySelector('.app'));
