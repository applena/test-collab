const client = require('../client');

function getLocationFromDataBase(city) {
  let SQL = 'SELECT * FROM locations WHERE search_query=$1;';
  let values = [city];
  return client.query(SQL, values)
    .then(results => {
      return results.rows[0];
    })
    .catch(err => console.error(err));
};

module.exports = getLocationFromDataBase;