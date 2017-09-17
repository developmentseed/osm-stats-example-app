var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var parallel = require('async').parallel;
var generateStats = require('../app/assets/scripts/utils/generateStats');

describe('generateCountryStats', function () {
  it(`should return an array with each hashtag's percentage of total country edits`, function (cb) {
    // an example country url
    const baseURL = 'https://osmstats.redcross.org';
    // Country cdoe fro Nigeria
    const countryCode = 'nga';
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

// describe('generateUserStats', function () {
//   it(`should return an array with a user's edits across countries the user has mapped in`, function (cb) {
  
//   })
// }) 