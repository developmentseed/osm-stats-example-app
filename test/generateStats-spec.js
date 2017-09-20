'use strict';

var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var parallel = require('async').parallel;
var waterfall = require('async').waterfall;
var detect = require('async').detect;
var map = require('async').map;
var filter = require('async').filter;
var generateStats = require('../app/assets/scripts/utils/generateStats');
// baseURL for all requests
const baseURL = 'https://osmstats.redcross.org';
// Country code fro Nigeria
const countryCode = 'nga';

describe('generateCountryStats', function () {
  it(`should return an array with each hashtag's percentage of total country edits`, function (cb) {
    // grab the generateCountryStats function out of the lib
    var generateCountryStats = generateStats.generateCountryStats;
    // fire a request and genreateCoutnryStats to the same endpoint
    // then make sure results are the same
    parallel([
      (done) => {
        request.get({
          rejectUnauthorized: false,
          url: `${baseURL}/countries/${countryCode}/hashtags`,
          headers: {'Content-Type': 'application/json'}
        }, function (err, res, body) {
          if (err || res.statusCode !== 200) {
            return done(null, []);
          }
          let stats;
          try {
            stats = JSON.parse(body);
          } catch (e) {
            return done(null, []);
          }
          done(null, stats);
        });
      },
      (done) => {
        generateCountryStats(baseURL, countryCode, done);     
      }
    ], (err, res) => {
      if (err) {
        return '';
      }
      // pull out the request and function stats from the parallel response.
      const requestStats = res[0];
      const functionStats = res[1];
      // make sure lengths are the same
      const requestStatsLength = requestStats.length;
      const functionStatsLength = functionStats.length;
      expect(functionStatsLength).to.be.equal(requestStatsLength);
      // get totalEdit (all edits in the entire country)
      const totalEdits = requestStats.map(hashtag => Number(hashtag.all_edits))
      .reduce((a, b) => { return a + b; }, 0);
      // make sure functionStats' 'edits' matches requestStats', same for 'code' and 'hashtag'
      // array.prototype.every returns true if each element passes a test, and false if not every element passes
      const everyRequestStatMatches = functionStats.every((functionStat) => {
        // find the matching raw api result in request stats
        const requestMatch = requestStats.find((hashtag) => {
          return hashtag.hashtag === functionStat.code;
        });
        const requestMatchPercEdits = ((Number(requestMatch.all_edits) / totalEdits) * 100).toFixed(2);
        // if the code and hashtag are the same (as they hsould if requestMatch holds a val)
        // AND edits and all edits match, return.
        return functionStat.edits === requestMatchPercEdits && functionStat.code === requestMatch.hashtag;
      });
      // expect each functionStat object to have an object in the raw api
      // with both the same code and perc of edits.
      expect(everyRequestStatMatches).to.be.equal(true);
      // get sum of % edits from function stats
      const editsSum = functionStats.reduce((a, b) => { return a + Number(b.edits); }, 0).toFixed(0);
      // expect editsSum to equal 100
      expect(Number(editsSum)).to.be.equal(100);
      cb();
    });
  });
});

describe('generateUserStats', function () {
  it(`should return an array with a user's edits across countries the user has mapped in`, function (cb) {
    const generateUserStats = generateStats.generateUserStats;
    // name of user we are searching results for
    const userName = 'piaco_dk';
    // run the generateUserStats function and run it manually in parallel
    parallel([
      (done) => {
        done(null, generateUserStats(baseURL, userName, cb));
      },
      (done) => {
        waterfall([
          // get countries list and return that list mapped to only country codes.
          (cb) => {
            request.get({
              rejectUnauthorized: false,
              url: `${baseURL}/countries`,
              headers: {'Content-Type': 'application/json'}
            }, (err, res, body) => {
              if (err || res.statusCode !== 200) {
                return cb('could not react osmstats api', []);            
              }
              // wrap json parse & map all try catch in case there is a problem with either
              let countryCodes;
              try {
                const countries = JSON.parse(body);
                map(countries, (country, next) => {
                  next(null, country.code);
                }, (err, mappedCountries) => {
                  if (err || countries.length !== mappedCountries.length) {
                    return cb(null, []);
                  }
                  countryCodes = mappedCountries;
                });
              } catch (e) {
                return cb('could gather list of countries from osmstats api', []);
              }
              cb(null, countryCodes);
            });
          },
          (res, cb) => {
            // attempt to generate a user stat for user in each country s/he mapped in
            map(res, (countryCode, next) => {
              // request users stats ${countryCode}
              const countryStatsURL = `${baseURL}/countries/${countryCode}/users`;
              request.get({
                rejectUnauthorized: false,
                url: countryStatsURL,
                headers: {'Content-Type': 'application/json'}
              }, (err, res, body) => {
                if (err || res.statusCode !== 200) {
                  next('could not gather stats for countryCode', []);
                }
                let countryUsersStats;
                // wrap json parse in a try catch in case the json is invalid.
                try {
                  // countryUsersStats is an array of objects, each object representing a user's edits.
                  countryUsersStats = JSON.parse(body);
                } catch (e) {
                  // when the json cannot be parsed, cb an empty array
                  return next(`Could not parse country's json`, []);
                }
                // detect is the asnyc package's equivalent to array.prototype.find;
                // https://caolan.github.io/async/docs.html#detect
                // it is used here to 'detect' an object for ${userName} exists in the array.
                detect(countryUsersStats, (user, finish) => {
                  finish(null, user.name === userName);
                }, (err, mappedCountryUserStats) => {
                  if (err && !mappedCountryUserStats) {
                    return next(null, null);      
                  }
                  console.log(mappedCountryUserStats);
                  // return an object with a code and edits k/v
                  next(null, {code: countryCode, edits: Number(mappedCountryUserStats.all_edits)});
                });
              });              
            }, (err, countryStats) => {
              if (err) {
                return cb(`could not generate user's stats`, []);
              }
              // filter returned country list for only those with stats
              filter(countryStats, (country, next) => {
                next(null, country.code);
              }, (err, res) => {
                if (err) {
                  return cb(null, []);
                }
                // map to only include user's edits
                map(res, (country, next) => {
                  next(null, country.edits);
                }, (err, edits) => {
                  if (err) {
                    return cb(null, []);
                  }
                  // get the user's total # of edits across all countries.
                  const totalEdits = edits.reduce((a, b) => { return a + b; }, 0);
                  // take 'res', and map it to inlcude objects of country & # of user edits
                  map(res, (country, next) => {
                    const userStats = {
                      code: country.code,
                      edits: ((country.edits / totalEdits) * 100).toFixed(2)
                    };
                    next(null, userStats);
                  }, (err, usersStats) => {
                    if (err) {
                      return cb(null, []);
                    }
                    // sort userStats descending
                    usersStats = usersStats.sort((a, b) => { return a.edits - b.edits; });
                    cb(null, usersStats);
                  });
                });
              });
            });
          }
        ], (err, res) => {
          if (err) {
            return done('could not generate user stats', []);
          }
          done(null, res);
        });
      }
    ], (err, res) => {
      if (err) {
        return cb();
      }
      cb();
    });
  });
});
