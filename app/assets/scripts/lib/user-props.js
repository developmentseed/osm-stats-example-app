import request from 'request';
import { parallel } from 'async';
import { readFile, writeFile } from 'fs';

const baseURL = 'https://osmstats.redcross.org/';
const userURL = baseURL + 'users/2913188';
const countriesURL = baseURL + 'countries';
const headers = {
  'Content-Type': 'application/json'
}

const reportBuildingStats = (cb) => {
  parallel([
    (cb) => {
      // get list of each country's code
      request.get({
        rejectUnauthorized: false,
        url: countriesURL,
        headers: headers
      }, (err, res, body) => {
        if(!err || res.statusCode === 200) {
          return cb(null, JSON.parse(body).map((country) => {return country.code}));
        }
      })
    }
  ], (err, res) => {
    if (err) {
      cb('error getting initial user data / country list', [])
    }
    let countryStats = res[0].map((countryCode) => {
      return countryStatsMaker(countryCode);
    })
    parallel(countryStats, (err, res) => {
      if (!(err)) {}
      res = res.filter((country) => {return country.code});
      const edits = res.map((country) => { return country.edits })
      const totalEdits = edits.reduce((a,b) => { return a + b}, 0);
      const countryProportions = res.map((country) => {
        let edits = ((country.edits/totalEdits) * 100).toFixed(2)
        return {
          code: country.code,
          propEdits: edits
        }
      }).sort((a, b) => {
        return b.propEdits - a.propEdits
      });
      readFile('./countries.geojson', (err, data) => {
        if (!err) {
          let geojson = JSON.parse(data.toString());
          geojson.features = geojson.features.map((feature) => {
            const matchingProp = countryProportions.find((country) => {
              return country.code === feature.properties.ISO_A3
            })
            if (matchingProp) {
              feature.properties = Object.assign(
                feature.properties,
                {propEdits: matchingProp.propEdits}
              )
            }
            return feature
          })
          writeFile('armasari_map.geojson', JSON.stringify(geojson), (err) => {
           if (!err) {
             console.log('we generated insights!');
             writeFile('armasari_props.json', JSON.stringify(countryProportions), (err) => {
               if (!err) {}
             })
          }
          })
        }
      })
    })
  })
}

const countryStatsMaker = (countryCode) => {
  const countryStatsURL = baseURL + 'countries/' + countryCode + '/users'
  return (cb) => {
    request.get({
      rejectUnauthorized: false,
      url: countryStatsURL,
      headers: headers
    }, (err, res, body) => {
      if(!err || res.statusCode === 200) {
        let countryUserStats;
        try {
         countryUserStats = JSON.parse(body)
        } catch (e) {
          return cb(`Could not parse country's json`, [])
        }
        countryUserStats = countryUserStats.find((user) => {
          console.log(user.name)
          return user.name === 'Sawan Shariar';
        })
        if (countryUserStats) {
          countryUserStats = parseFloat(countryUserStats.all_edits)
          return cb(null, {code: countryCode, edits: countryUserStats})
        }
        cb(null, 0);
      }
    })
  }
}

reportBuildingStats((err, res) => {
  if (!(err)) {}
})
