var request = require('request');
var parallel = require('async').parallel;
var map = require('async').map;
var filter = require('async').filter;
var detect = require('async').detect;

/**
 * @function generateCountryStats
 * @description generates a list of % of total country edits made by each hashtag in that country
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} countryCode 3 letter country code used to make country endpoints
 * @param {function} cb callback function return the stats
 * @return {object} a list of objects containing % of country edits attributable to a given hashtag
 */
exports.generateCountryStats = function (baseURL, countryCode, cb) {
  // headers needed for http request
  const headers = {
    'Content-Type': 'application/json'
  };
  // country specific api endpoint
  const countryURL = `${baseURL}/countries/${countryCode}/hashtags`;
  request.get({
    rejectUnauthorized: false,
    url: countryURL,
    headers: headers
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      // if unable to retrieve a request, return an empty list
      // the front end deals with no stats returned scenarios
      return cb(null, []);
    }
    // parse request response
    let stats = JSON.parse(body);
    // the array return roughly follows a spec of:
    // [
    //  {
    //  'all_edits': ##,
    //  'km_roads_added': ##
    //   ... other thigns
    //   'hashtag'
    //   }
    // ]
    // so, to return # of hashtag total edits to entire country total edits,
    // first all hashtags 'all_edits' are summed and saved to totalEdits
    let totalEdits = stats.map((group) => {
      return Number(group.all_edits);
    }).reduce((a, b) => { return a + b; }, 0);
    // then map response to be objects including:
    //    1. % of edits per hashtag (the groups edits / total country edits)
    //    2. the hashtag name.
    stats = stats.map((group) => {
      let edits = ((Number(group.all_edits) / totalEdits) * 100).toFixed(2);
      return {
        code: group.hashtag,
        edits: edits
      };
    // sort this mapped array in descending order
    }).sort((a, b) => {
      return b.edits - a.edits;
    });
    // call it back.
    cb(null, stats);
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
exports.generateUserStats = function (baseURL, userName, cb) {
  // first get the list of all countries
  const countriesURL = `${baseURL}/countries`;
  const headers = {
    'Content-Type': 'application/json'
  };
  parallel([
    (done) => {
      request.get({
        rejectUnauthorized: false,
        url: countriesURL,
        headers: headers
      }, (err, res, body) => {
        // if a proper response map the returned list of objects to be
        // only a list of country codes.
        if (err || res.statusCode !== 200) {
        }
        try {
          map(JSON.parse(body), (country, cb) => {
            cb(null, country.code);
          }, (err, mappedCountries) => {
            if (!err) {
              return done(null, mappedCountries);
            }
          });
          // if there is an error, return an empty list
        } catch (e) {
          done('could not generate stats', []);
        }
      });
    }
  ], (err, res) => {
    if (err) {
      cb('error getting initial user data / country list', []);
    }
    // for each country, look for the user's stats in that country
    // if there are stats, return an object with said stats, if not, return an empty object
    map(res[0], (countryCode, next) => {
      next(null, userCountryStatsMaker(baseURL, countryCode, userName, headers));
    }, (err, countryStats) => {
      if (err) {
        return cb(null, {});
      }
      parallel(countryStats, (err, res) => {
        if (err) {}
        filter(res, (country, next) => {
          next(null, country.code);
        }, (err, res) => {
          if (err) {}
          map(res, (country, next) => {
            next(null, country.edits);
          }, (err, edits) => {
            if (err) {}
            const totalEdits = edits.reduce((a, b) => { return a + b; }, 0);
            map(res, (country, next) => {
              const userStat = {
                code: country.code,
                edits: ((country.edits / totalEdits) * 100).toFixed(2)
              };
              next(null, userStat);
            }, (err, userStats) => {
              if (err) {}
              cb(null, userStats.sort((a, b) => { return a.edits - b.edits; })); 
            });
          });
        });
      });
    });
  });
};

/**
 * @function userCountryStatsMaker
 * @description returns a user's stats in a country if the stats exist.
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} countryCode 3 letter country code used to make country endpoints
 * @param {string} userName osm user name of user for which stats are being generated
 * @param {object} headers request headers needed for making request
 * @return {object} object with country code and userName's # of edits in countryCode
 */
var userCountryStatsMaker = function (baseURL, countryCode, userName, headers) {
  const countryStatsURL = `${baseURL}/countries/${countryCode}/users`;
  return (cb) => {
    request.get({
      rejectUnauthorized: false,
      url: countryStatsURL,
      headers: headers
    }, (err, res, body) => {
      if (!err || res.statusCode === 200) {
        let countryUsersStats;
        // wrap json parse in a try catch in case the json is invalid.
        try {
          // countryUsersStats is an array of objects, each object representing a user's edits.
          countryUsersStats = JSON.parse(body);
        } catch (e) {
          // when the json cannot be parsed, cb an empty array
          return cb(`Could not parse country's json`, []);
        }
        // detect is the asnyc package's equivalent to array.prototype.find;
        // https://caolan.github.io/async/docs.html#detect
        // it is used here to 'detect' an object for ${userName} exists in the array.
        detect(countryUsersStats, (user, next) => {
          next(null, user.name === userName);
        }, (err, countryUserStats) => {
          if (err && !countryUserStats) {
            return cb(null, null);      
          }
          // return an object with a code and edits k/v
          cb(null, {code: countryCode, edits: Number(countryUserStats.all_edits)});
        });
      }
    });
  };
};
