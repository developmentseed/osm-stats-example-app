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

const userSuggestorFilter = (state = {username: ''}, action) => {
  switch (action.type) {
    case actions.UPDATE_USERS_SUGGESTOR:
      state = cloneDeep(state);
      state.username = action.username;
      break;
  }
  return state;
};

const countrySuggestorFilter = (state = {countryname: ''}, action) => {
  switch (action.type) {
    case actions.UPDATE_COUNTRIES_SUGGESTOR:
      state = cloneDeep(state);
      state.countryname = action.countryname;
      break;
  }
  return state;
};

export default combineReducers({
  missingmapsUsers,
  missingmapsCountries,
  userSuggestorFilter,
  countrySuggestorFilter
});
