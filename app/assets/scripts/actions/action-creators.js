import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                             USERS                             //
// ////////////////////////////////////////////////////////////////

function requestUsers () {
  return {
    type: actions.REQUEST_USERS
  };
}

function receiveUsers (json) {
  return {
    type: actions.RECEIVE_USERS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchUsers () {
  return (dispatch) => {
    dispatch(requestUsers());
    let url = `${config.api}/users`;
    return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch(receiveUsers(json));
      });
  };
}

// ////////////////////////////////////////////////////////////////
//                           COUNTRIES                           //
// ////////////////////////////////////////////////////////////////

function requestCountries () {
  return {
    type: actions.REQUEST_COUNTRIES
  };
}

function recieveCountries (json) {
  return {
    type: actions.RECIEVE_COUNTRIES,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchCountries () {
  return (dispatch) => {
    dispatch(requestCountries());
    let url = `${config.api}/countries`;
    return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch(recieveCountries(json));
      });
  };
}

// ////////////////////////////////////////////////////////////////
//                       USERS SUGGESTOR                         //
// ////////////////////////////////////////////////////////////////

export function updateUserSuggestor (text) {
  return {
    type: actions.UPDATE_USERS_SUGGESTOR,
    username: text,
    recievedAt: Date.now()
  };
}

// ////////////////////////////////////////////////////////////////
//                       COUNTRY SUGGESTOR                       //
// ////////////////////////////////////////////////////////////////

export function updateCountrySuggestor (text) {
  return {
    type: actions.UPDATE_COUNTRIES_SUGGESTOR,
    countryname: text,
    recievedAt: Date.now()
  };
}

// ////////////////////////////////////////////////////////////////
//                     UPDATE SUGGESTIOR                         //
// ////////////////////////////////////////////////////////////////

export function updateSuggestions (json) {
  return {
    type: actions.UPDATE_SUGGESTIONS,
    json: json,
    recievedAt: Date.now()
  };
}

// ////////////////////////////////////////////////////////////////
//                            LAST TYPED                         //
// ////////////////////////////////////////////////////////////////

export function setlastTyped (text) {
  return {
    type: actions.SET_LAST_TYPED_SUGGESTION,
    text: text,
    recievedAt: Date.now()
  };
}

// ////////////////////////////////////////////////////////////////
//                             UPDATING                          //
// ////////////////////////////////////////////////////////////////

export function setSuggestionsUpdating (bool) {
  return {
    type: actions.SET_SUGGESTIONS_UPDATING,
    bool: bool,
    receivedAt: Date.now()
  };
}
