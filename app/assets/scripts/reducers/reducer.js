import React from 'react';
import { combineReducers } from 'redux';
import * as actions from '../actions/action-types';
import { cloneDeep, includes } from 'lodash';

// ////////////////////////////////////////////////////////////////
//                         API-DATA                              //
// ////////////////////////////////////////////////////////////////

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

// ////////////////////////////////////////////////////////////////
//                       SUGGESTIONS                             //
// ////////////////////////////////////////////////////////////////

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

const currentSuggestions = (state = {currentSuggestions: ['']}, action) => {
  switch (action.type) {
    case actions.UPDATE_SUGGESTIONS:
      state = cloneDeep(state);
      state.currentSuggestions = action.json;
      break;
  }
  return state;
};

const lastTyped = (state = {lastTyped: ''}, action) => {
  switch (action.type) {
    case actions.SET_LAST_TYPED_SUGGESTION:
      state = cloneDeep(state);
      state.lastTyped = action.text;
      break;
  }
  return state;
};

// ////////////////////////////////////////////////////////////////
//                       GENERATE STATS                          //
// ////////////////////////////////////////////////////////////////

const stats = (state = {countryStats: [], userStats: [], statsFetched: false, fetching: false, fetched: false}, action) => {
  switch (action.type) {
    case actions.REQUEST_COUNTRY_STATS:
      state = cloneDeep(state);
      state.fetching = true;
      state.statsFetched = false;
      break;
    case actions.RECEIVE_COUNTRY_STATS:
      state = cloneDeep(state);
      state.countryStats = action.json;
      state.fetching = false;
      state.fetched = true;
      state.statsFetched = true;
      break;
    case actions.REQUEST_USER_STATS:
      state = cloneDeep(state);
      state.fetching = true;
      state.statsFetched = false;
      break;
    case actions.RECEIVE_USER_STATS:
      state = cloneDeep(state);
      state.userStats = action.json;
      state.fetching = false;
      state.fetched = true;
      state.statsFetched = true;
      break;
  }
  return state;
};

// ////////////////////////////////////////////////////////////////
//                 VISUALIZATION/SUGGESTOR LOGIC                 //
// ////////////////////////////////////////////////////////////////

const setSuggestor = (state = {setSuggestor: false}, action) => {
  switch (action.type) {
    case actions.SET_SUGGESTOR:
      state = cloneDeep(state);
      state.resetSuggestor = action.bool;
      break;
  }
  return state;
};

export default combineReducers({
  missingmapsUsers,
  missingmapsCountries,
  userSuggestorFilter,
  countrySuggestorFilter,
  lastTyped,
  currentSuggestions,
  stats,
  setSuggestor
});
