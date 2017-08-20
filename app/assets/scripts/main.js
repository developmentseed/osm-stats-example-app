'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';
import reducer from './reducers/reducer';
import config from './config';
import App from './containers/App';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

const finalCreateStore = compose(
  applyMiddleware(logger, thunkMiddleware)
)(createStore);

const store = finalCreateStore(reducer);

render((
    <Provider store={store} >
      <App />
    </Provider>
), document.querySelector('.app'));
