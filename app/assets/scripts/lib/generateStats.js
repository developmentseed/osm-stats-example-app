import request from 'request';
import { parallel, map, filter, detect } from 'async';

/**
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} countryCode 3 letter country code used to make country endpoints
 * @param {function} cb callback function that helps return the stats object.
 * @return {object} a list of objects containing % of country edits attributable to a given hashtag
 */
export function generateCountryStats (baseURL, countryCode, cb) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const countryURL = `${baseURL}/countries/${countryCode}/hashtags`;
  request.get({
    rejectUnauthorized: false,
    url: countryURL,
    headers: headers
  }, (err, res, body) => {
    if (!err || res.statusCode === 200) {
      let stats = JSON.parse(body);
      let totalEdits = stats.map((group) => {
        return Number(group.all_edits);
      }).reduce((a, b) => { return a + b; }, 0);
      stats = stats.map((group) => {
        let edits = ((Number(group.all_edits) / totalEdits) * 100).toFixed(2);
        return {
          group: group.hashtag,
          all_edits: edits
        };
      }).sort((a, b) => {
        return b.all_edits - a.all_edits;
      });
      cb(null, stats);
    }
  });
}

/**
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} userName osm user name of user for which stats are being generated
 * @param {function} cb callback function to return the user stats
 * @return {object} a list of objects containing % of users' total edits attributable to a certain country
 */
export function generateUserStats (baseURL, userName, cb) {
  const countriesURL = `${baseURL}/countries`;
  const headers = {
    'Content-Type': 'application/json'
  };
  parallel([
    (done) => {
      // get list of each country's code
      request.get({
        rejectUnauthorized: false,
        url: countriesURL,
        headers: headers
      }, (err, res, body) => {
        if (!err || res.statusCode === 200) {
          try {
            map(JSON.parse(body), (country, cb) => {
              cb(null, country.code);
            }, (err, mappedCountries) => {
              if (!err) {
                return done(null, mappedCountries);
              }
            });
          } catch (e) {
            cb('could not generate stats', []);
          }
        }
      });
    }
  ], (err, res) => {
    if (err) {
      cb('error getting initial user data / country list', []);
    }
    map(res[0], (countryCode, next) => {
      next(null, countryStatsMaker(baseURL, countryCode, userName, headers));
    }, (err, countryStats) => {
      if (!err) {
        parallel(countryStats, (err, res) => {
          if (!err) {
            filter(res, (country, next) => {
              next(null, country.code);
            }, (err, res) => {
              if (!err) {
                map(res, (country, next) => {
                  next(null, country.edits);
                }, (err, edits) => {
                  if (!err) {
                    const totalEdits = edits.reduce((a, b) => { return a + b; }, 0);
                    map(res, (country, next) => {
                      const userStat = {
                        code: country.code,
                        edits: ((country.edits / totalEdits) * 100).toFixed(2)
                      };
                      next(null, userStat);
                    }, (err, userStats) => {
                      if (!err) {
                        cb(null, userStats.sort((a, b) => { return a.edits - b.edits; }));
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

/**
 * @param {string} baseURL the osm-stats-api baseURL. can be a prod, staging, or local instance
 * @param {string} countryCode 3 letter country code used to make country endpoints
 * @param {string} userName osm user name of user for which stats are being generated
 * @param {object} headers request headers needed for making request
 * @return {object} object with country code and userName's # of edits in countryCode
 */
const countryStatsMaker = (baseURL, countryCode, userName, headers) => {
  const countryStatsURL = `${baseURL}/countries/${countryCode}/users`;
  return (cb) => {
    request.get({
      rejectUnauthorized: false,
      url: countryStatsURL,
      headers: headers
    }, (err, res, body) => {
      if (!err || res.statusCode === 200) {
        let countryUsersStats;
        try {
          countryUsersStats = JSON.parse(body);
        } catch (e) {
          return cb(`Could not parse country's json`, []);
        }
        detect(countryUsersStats, (user, next) => {
          next(null, user.name === userName);
        }, (err, countryUserStats) => {
          if (!err && countryUserStats) {
            return cb(null, {code: countryCode, edits: Number(countryUserStats.all_edits)});
          }
          cb(null, {});
        });
      }
    });
  };
};
