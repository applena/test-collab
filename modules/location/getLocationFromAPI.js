const superagent = require('superagent');
const storeLocationInDataBase = require('./storeLocationinDataBase');

function getLocationFromAPI(city) {
  console.log('going to the api to get information')
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;
  return superagent.get(url)
    .then(data => {
      return storeLocationInDataBase(city, data.body) 
    });
};

module.exports = getLocationFromAPI;