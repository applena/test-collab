const client = require('../client');
const Location = require('./locationConstructor.js');

function storeLocationInDataBase( city, data ) {
  const location = new Location(data.results[0]);
  let SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
  let values = [city, location.formatted_query, location.latitude, location.longitude];
  return client.query(SQL, values)
    .then( results => {
      const savedLocation = results.rows[0];
      cache[city] = savedLocation;
      return savedLocation;
    });
}

module.exports = storeLocationInDataBase;