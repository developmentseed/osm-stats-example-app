import { combineReducers } from 'redux';
import * as actions from '../actions/action-types';
import { cloneDeep } from 'lodash';

const missingmapsUsers = (state = {users: [], fetching: false, fetched: false}, action) => {
  switch (action.type) {
    case actions.REQUEST_USERS:
      state = cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECEIVE_USERS:
      state = cloneDeep(state);
      state = action.json;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

const missingmapsCountries = (state = {countries: [], fetching: false, fetched: false}, action) => {
  switch (action.type) {
    case actions.REQUEST_COUNTRIES:
      state = cloneDeep(state);
      state.fetching = true;
      break;
    case actions.RECIEVE_COUNTRIES:
      state = cloneDeep(state);
      state = action.json;
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
};

export default combineReducers({
  missingmapsUsers,
  missingmapsCountries
});
