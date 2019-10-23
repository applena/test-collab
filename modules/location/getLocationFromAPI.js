const superagent = require('superagent');
const storeLocationInDataBase = require('./storeLocationinDataBase');

function getLocationFromAPI(city) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  return superagent.get(url)
    .then(data => storeLocationInDataBase(city, data.body) );
};

module.exports = getLocationFromAPI;