'use strict';

var request = require('request');
var parallel = require('async').parallel;
var map = require('async').map;
var filter = require('async').filter;
var detect = require('async').detect;
var rp = require('request-promise');
Promise = require('bluebird');

/**
 * @function generateCountryStats
 * @description generates a list of % of total country edits made by each hashtag in that country
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} countryCode 3 letter country code used to make country endpoints
 * @param {function} cb callback function return the stats
 * @return {object} a list of objects containing % of country edits attributable to a given hashtag
 */
exports.generateCountryStats = function (baseURL, countryCode) {
  return new Promise((resolve, reject) => {
    // country specific api endpoint
    const countryURL = `${baseURL}/countries/${countryCode}/hashtags`;
    const request = {
      rejectUnauthorized: false,
      url: countryURL,
      headers: {'Content-Type': 'application/json'}
    };
    rp(request)
    .then(stats => {
      try {
        stats = JSON.parse(stats);
      } catch (e) {
        throw new Error(e);
      }
      // get total number of edits in country to normalize values with
      let totalEdits = stats.map((ht) => Number(ht.all_edits))
      .reduce((a, b) => { return a + b }, 0)
      stats = stats.map((ht) => {
        let edits = ((Number(ht.all_edits)/totalEdits) * 100).toFixed(2);
        return { code: ht.hashtag, edits: edits };
      })
      .sort((a, b) => b.edits - a.edits);
      resolve(stats);
    })
    .catch(e => reject(e));
  });
}

/**
 * @function generateUserStats
 * @description generates list of the # of a user's edits made across each country they made edits in
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} userName osm user name of user for which stats are being generated
 * @param {function} cb callback function to return the user stats
 * @return {object} a list of objects containing % of users' total edits attributable to a certain country
 */
exports.generateUserStats = function (baseURL, userId) {
  return new Promise((resolve, reject) => {
    // first get the list of all countries
    const countriesURL = `${baseURL}/${userId}/countries`;
    const request = {
      uri: countriesURL,
      headers: {'Content-Type': 'application/json'},
      rejectUnauthorized: false
    };
    return rp(request)
    .then(countryStats => {
      // wrap json parse in a try catch in case of errors
      try {
        countryStats = JSON.parse(countryStats);
      } catch (e) {
        throw new Error('Could not parse countries');
      }
      // sort country stats in descending order
      countryStats = countryStats.sort((a, b) => b.total_edits - a.total_edits);
      // return country code properties from each country object;
      resolve(countryStats);
    })
    .catch(e => {
      reject(e);
    });
  });
};