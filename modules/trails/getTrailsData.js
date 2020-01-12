const Trail = require('./trailsConstructor');
const superagent = require('superagent');

function getTrailsData(latitude, longitude, response){
  const url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=200&key=${process.env.TRAILS_API_KEY}`;

  superagent.get(url)
    .then(results => {
      const trailsResults = results.body.trails.map(trail => {
        return new Trail(trail);
      })
      response.send(trailsResults);
    })
}

module.exports = getTrailsData;