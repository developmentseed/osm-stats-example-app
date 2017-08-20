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
