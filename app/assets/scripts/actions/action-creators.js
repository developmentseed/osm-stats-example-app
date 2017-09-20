import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';
import { generateCountryStats, generateUserStats } from '../utils/generateStats';

// ////////////////////////////////////////////////////////////////
//                             USERS                             //
// ////////////////////////////////////////////////////////////////

// below actions fetch list of users from osm stats api

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

// below actions fetch list of countries from osm stats api

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

// updates current user suggestor, or the string used to filter users

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

// updates current country suggestor, or the string used to filter users

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

// updates suggestions

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

// sets last typed to either users or countries

export function setlastTyped (text) {
  return {
    type: actions.SET_LAST_TYPED_SUGGESTION,
    text: text,
    recievedAt: Date.now()
  };
}

// ////////////////////////////////////////////////////////////////
//                          FETCH STATS                          //
// ////////////////////////////////////////////////////////////////

// fetches either user or country stats.

function requestUserStats () {
  return {
    type: actions.REQUEST_USER_STATS
  };
}

function recieveUserStats (json) {
  return {
    type: actions.RECEIVE_USER_STATS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchUserStats (userName) {
  return (dispatch) => {
    dispatch(requestUserStats());
    // utils function that queries osm stats api for user stats.
    // details on what the stats are exist in the actual util's documentation
    generateUserStats(config.api, userName, (err, stats) => {
      if (!err) {
        dispatch(recieveUserStats(stats));
      }
    });
  };
}

function requestCountryStats () {
  return {
    type: actions.REQUEST_COUNTRY_STATS
  };
}

function recieveCountryStats (json) {
  return {
    type: actions.RECEIVE_COUNTRY_STATS,
    json: json,
    receivedAt: Date.now()
  };
}

export function fetchCountryStats (countryCode) {
  return (dispatch) => {
    // utils function that queries osm stats api for coutry stats
    // you guessed it, what is generated is told in the utils documetation
    dispatch(requestCountryStats());
    generateCountryStats(config.api, countryCode, (err, stats) => {
      if (!err) {
        dispatch(recieveCountryStats(stats));
      }
    });
  };
}

// ////////////////////////////////////////////////////////////////
//                 VISUALIZATION/SUGGESTOR LOGIC                 //
// ////////////////////////////////////////////////////////////////

// sets a boolean used to determine if visualization or suggestor should
// be visualized

export function setSuggestor (bool) {
  return {
    type: actions.SET_SUGGESTOR,
    bool: bool,
    receivedAt: Date.now()
  };
}
