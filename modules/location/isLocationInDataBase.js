const client = require('../client');

function isLocationInDataBase(city){
  const sql = 'SELECT * FROM locations WHERE search_query=$1;';
  const values = [city];
  
  return client.query(sql, values)

}

module.exports = isLocationInDataBase;