'use strict';

import React from 'react';
import { render } from 'react-dom';
import config from './config';
import App from './containers/App';
// const logger = createLogger({
//   level: 'info',
//   collapsed: true,
//   predicate: (getState, action) => {
//     return (config.environment !== 'production');
//   }
// });
//
// const finalCreateStore = compose(
//   applyMiddleware(logger, thunkMiddleware)
// )(createStore);
//
// const store = finalCreateStore(reducer);

render((
    <App />
), document.querySelector('.app'));
