import request from 'request';

export function generateCountryStats (country, cb) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const countryURL = `https://osmstats.redcross.org/countries/${country}/hashtags`;
  request.get({
    rejectUnauthorized: false,
    url: countryURL,
    headers: headers
  }, (err, res, body) => {
    if (!err || res.statusCode === 200) {
      let stats = JSON.parse(body);
      let totalEdits = stats.map((group) => {
        return parseFloat(group.all_edits);
      }).reduce((a, b) => { return a + b; }, 0);
      stats = stats.map((group) => {
        let edits = ((parseFloat(group.all_edits) / totalEdits) * 100);
        edits = edits.toFixed(2);
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
